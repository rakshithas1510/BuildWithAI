import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface WeeklyModule {
    tasks: Array<Task>;
    weekNumber: bigint;
}
export interface Task {
    durationMins: bigint;
    title: string;
    isCompleted: boolean;
    description: string;
    associatedSkill: string;
}
export interface StudyPlan {
    jobRole: string;
    modules: Array<WeeklyModule>;
}
export interface UserProfile {
    username: string;
    targetJobRole: string;
    skills: Array<Skill>;
    studyGoals: string;
}
export interface Skill {
    id: string;
    name: string;
    level: bigint;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    analyzeSkillGaps(): Promise<[bigint, Array<Skill>]>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    createOrUpdateProfile(username: string, targetJobRole: string, skills: Array<Skill>, studyGoals: string): Promise<void>;
    generateDefaultPlan(): Promise<void>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getProfile(): Promise<UserProfile | null>;
    getReadinessScore(): Promise<bigint>;
    getStudyPlan(): Promise<StudyPlan | null>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    markTaskComplete(week: bigint, day: bigint): Promise<void>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
}
