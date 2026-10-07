// This file was imported by src/types/whatsapp.ts but committed empty, which
// made that module unresolvable and broke everything downstream of it.
//
// `WorkspaceRole` is referenced by exactly one field — AgentPerformance.role —
// and nothing in the codebase constructs an AgentPerformance or supplies a
// role value, so there is nothing to infer a union from. Left as a widened
// alias rather than inventing role names that no screen or fixture uses;
// narrow it to the real union once those are decided.
export type WorkspaceRole = string;
