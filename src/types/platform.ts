// The platform user shape lives in ./user; this module is the path several
// chat-support files import it from. Re-exported rather than redefined so there
// is one definition — a parallel copy would drift the moment either changed.
//
// This file was imported but never committed, which is why `AuthUser extends
// PlatformUser` resolved to `{}` and every `user.id` read failed to compile.
export type {
  PlatformUser,
  PlatformUserRole,
  PlatformUserCategory,
} from "./user";
