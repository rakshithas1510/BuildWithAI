import Map "mo:core/Map";
import Array "mo:core/Array";
import Runtime "mo:core/Runtime";
import Text "mo:core/Text";
import Principal "mo:core/Principal";
import Nat "mo:core/Nat";
import AccessControl "authorization/access-control";
import MixinAuthorization "authorization/MixinAuthorization";

actor {
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  type Skill = {
    id : Text;
    name : Text;
    level : Nat; // 1-Basic, 2-Intermediate, 3-Advanced
  };

  type Task = {
    title : Text;
    description : Text;
    durationMins : Nat;
    associatedSkill : Text;
    isCompleted : Bool;
  };

  type WeeklyModule = {
    weekNumber : Nat;
    tasks : [Task];
  };

  type StudyPlan = {
    jobRole : Text;
    modules : [WeeklyModule];
  };

  type UserProfile = {
    username : Text;
    targetJobRole : Text;
    skills : [Skill];
    studyGoals : Text;
  };

  let jobRoleSkills = Map.empty<Text, [Skill]>();
  let userProfiles = Map.empty<Principal, UserProfile>();
  let studyPlans = Map.empty<Principal, StudyPlan>();

  // Required profile functions per instructions
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can get profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  public shared ({ caller }) func createOrUpdateProfile(username : Text, targetJobRole : Text, skills : [Skill], studyGoals : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can create or update profiles");
    };
    let profile : UserProfile = {
      username;
      targetJobRole;
      skills;
      studyGoals;
    };
    userProfiles.add(caller, profile);
  };

  public query ({ caller }) func getProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can get profiles");
    };
    userProfiles.get(caller);
  };

  public shared ({ caller }) func generateDefaultPlan() : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can generate study plans");
    };
    let profile = switch (userProfiles.get(caller)) {
      case (null) { Runtime.trap("Profile not found") };
      case (?p) { p };
    };

    let modules : [WeeklyModule] = Array.tabulate<WeeklyModule>(
      4,
      func(week) {
        let tasks : [Task] = Array.tabulate<Task>(
          5,
          func(day) {
            let taskIndex = week * 5 + day;
            {
              title = "Task " # (taskIndex + 1).toText();
              description = "Complete " # (taskIndex + 1).toText() # " task";
              durationMins = 60;
              associatedSkill = if (profile.skills.size() > 0) {
                profile.skills[0].id;
              } else {
                "defaultSkill";
              };
              isCompleted = false;
            };
          },
        );
        {
          weekNumber = week + 1;
          tasks;
        };
      },
    );

    let plan : StudyPlan = {
      jobRole = profile.targetJobRole;
      modules;
    };

    studyPlans.add(caller, plan);
  };

  public shared ({ caller }) func markTaskComplete(week : Nat, day : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can mark tasks complete");
    };
    switch (studyPlans.get(caller)) {
      case (null) { Runtime.trap("No study plan found") };
      case (?plan) {
        if (week == 0) { Runtime.trap("Week number must be greater than 0") };

        let updatedModules = plan.modules.toVarArray<WeeklyModule>();
        if (week - 1 >= updatedModules.size()) {
          Runtime.trap("Week out of bounds");
        };

        let moduleTasks = updatedModules[week - 1].tasks.toVarArray<Task>();

        if (day >= moduleTasks.size()) {
          Runtime.trap("Day out of bounds");
        };

        moduleTasks[day] := {
          title = moduleTasks[day].title;
          description = moduleTasks[day].description;
          durationMins = moduleTasks[day].durationMins;
          associatedSkill = moduleTasks[day].associatedSkill;
          isCompleted = true;
        };

        updatedModules[week - 1] := {
          weekNumber = updatedModules[week - 1].weekNumber;
          tasks = moduleTasks.toArray();
        };

        let updatedPlan : StudyPlan = {
          jobRole = plan.jobRole;
          modules = updatedModules.toArray();
        };

        studyPlans.add(caller, updatedPlan);
      };
    };
  };

  public query ({ caller }) func getStudyPlan() : async ?StudyPlan {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can get study plans");
    };
    studyPlans.get(caller);
  };

  public shared ({ caller }) func analyzeSkillGaps() : async (Nat, [Skill]) {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can analyze skill gaps");
    };
    let profile = switch (userProfiles.get(caller)) {
      case (null) { Runtime.trap("Profile not found") };
      case (?p) { p };
    };

    let requiredSkills = switch (jobRoleSkills.get(profile.targetJobRole)) {
      case (null) { [] };
      case (?skills) { skills };
    };

    if (requiredSkills.size() == 0) {
      Runtime.trap("No required skills found for this job role");
    };

    let userSkillIds = profile.skills.map(func(skill) { skill.id });

    let missingSkills = requiredSkills.filter(
      func(reqSkill) {
        not userSkillIds.any(
          func(id) {
            id == reqSkill.id;
          }
        );
      }
    );

    let missingSkillCount = missingSkills.size();
    let totalRequiredSkills = requiredSkills.size();

    let readinessScore = if (totalRequiredSkills == 0) { 0 } else if (missingSkillCount == 0) {
      100;
    } else {
      100 - (missingSkillCount * 100) / totalRequiredSkills;
    };

    (readinessScore, missingSkills);
  };

  public query ({ caller }) func getReadinessScore() : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      return 0;
    };

    switch (studyPlans.get(caller)) {
      case (null) { 0 };
      case (?plan) {
        var totalTasks = 0;
        var completedTasks = 0;

        for (module_ in plan.modules.values()) {
          for (task in module_.tasks.values()) {
            totalTasks += 1;
            if (task.isCompleted) {
              completedTasks += 1;
            };
          };
        };

        if (totalTasks == 0) { 0 } else {
          completedTasks * 100 / totalTasks;
        };
      };
    };
  };

  system func preupgrade() {
    jobRoleSkills.add(
      "Frontend Developer",
      [
        { id = "html"; name = "HTML"; level = 2 },
        { id = "css"; name = "CSS"; level = 2 },
      ],
    );
    jobRoleSkills.add(
      "Backend Developer",
      [
        { id = "nodejs"; name = "Node.js"; level = 2 },
        { id = "api"; name = "API Development"; level = 2 },
      ],
    );
  };
};

