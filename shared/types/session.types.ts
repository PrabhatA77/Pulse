export type SessionStatus = 
    | "idle"
    | "question_generated"
    | "coding"
    | "submitted"
    | "evaluated"
    | "follow_up";

export interface SessionState {
    status : SessionStatus;
    sessionId: string;
}