import bcrypt from "bcrypt";
import { User, IUser } from "../models/User.js";

const DUPLICATE_KEY_ERROR_CODE = 11000;

export interface CreateUserInput {
  name: string;
  email: string;
  password: string;
  role: string;
  department: string;
}

export interface CreateUserResult {
  id: string;
  message: string;
}

export class DuplicateEmailError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "DuplicateEmailError";
  }
}

function isDuplicateKeyError(err: unknown): boolean {
  return (
    typeof err === "object" &&
    err !== null &&
    (err as { code?: number }).code === DUPLICATE_KEY_ERROR_CODE
  );
}

export async function createUser(
  input: CreateUserInput,
): Promise<CreateUserResult> {
  try {
    // Hash password before storing
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(input.password, saltRounds);

    const user = await User.create({
      name: input.name,
      email: input.email,
      password: hashedPassword,
      role: input.role,
      department: input.department,
    } as IUser);

    return {
      id: user._id.toString(),
      message: "User created successfully",
    };
  } catch (err) {
    if (isDuplicateKeyError(err)) {
      throw new DuplicateEmailError("A user with this email already exists");
    }
    throw err;
  }
}
