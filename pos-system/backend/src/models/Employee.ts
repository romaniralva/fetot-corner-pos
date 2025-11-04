import mongoose, { Schema, Document } from "mongoose";

export interface IEmployee extends Document {
  uid: string;
  name: string;
  email: string;
  position: string;
  contactNo: string;
  address: string;
}

const employeeSchema = new Schema<IEmployee>(
  {
    uid: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    position: { type: String, required: true },
    contactNo: { type: String, required: true },
    address: { type: String, required: true },
  },
  { timestamps: true }
);

export const Employee = mongoose.model<IEmployee>("Employee", employeeSchema);
