import mongoose, { Schema, Document } from "mongoose";
import { Role, Status } from "./enums";

export interface ICredential extends Document {
  uid: string;
  email: string;
  passwordHash: string;
  role: Role;
  status: Status;
}

const credentialSchema = new Schema<ICredential>(
  {
    uid: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },
    role: {
      type: String,
      enum: Object.values(Role),
      default: Role.Cashier,
      required: true,
    },
    status: {
      type: String,
      enum: Object.values(Status),
      default: Status.Active,
      required: true,
    },
  },
  { timestamps: true }
);

export const Credential = mongoose.model<ICredential>(
  "Credential",
  credentialSchema
);
