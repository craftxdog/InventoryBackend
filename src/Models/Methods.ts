import mongoose, { Schema, Document, Types, PopulatedDoc } from "mongoose";
import { IMethodEOQ } from "./MethodEOQ";
import { IMethodCMC } from "./MethodCMC";
import { IMethodCRP } from "./MethodCRP";
import { MethodType, methodType } from "../Utils/methodType";
import { IMethodRI } from "./MethodRI";

export interface IMethods extends Document {
  title: string;
  product: string;
  description: string;
  methodType: MethodType;
  project: Types.ObjectId;
  methodEOQ: PopulatedDoc<IMethodEOQ & Document>[];
  methodCMC: PopulatedDoc<IMethodCMC & Document>[];
  methodCRP: PopulatedDoc<IMethodCRP & Document>[];
  methodRI: PopulatedDoc<IMethodRI & Document>[];
}

const methodSchema: Schema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    product: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    methodType: {
      type: String,
      enum: Object.values(methodType),
      default: methodType.NULL,
      required: true,
    },
    project: {
      type: Types.ObjectId,
      ref: "Project",
    },
    methodEOQ: [
      {
        type: Types.ObjectId,
        ref: "MethodEOQ",
      },
    ],
    methodCMC: [
      {
        type: Types.ObjectId,
        ref: "MethodCMC",
      },
    ],
    methodCRP: [
      {
        type: Types.ObjectId,
        ref: "MethodCRP",
      },
    ],
    methodRI: [
      {
        type: Types.ObjectId,
        ref: "MethodRI",
      },
    ],
  },
  { timestamps: true },
);

const Methods = mongoose.model<IMethods>("Methods", methodSchema);
export default Methods;
