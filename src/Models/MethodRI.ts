import mongoose, { Schema, Document } from "mongoose";
import { MethodType, methodType } from "../Utils/methodType";

export interface IMethodRI extends Document {
  methodName: string;
  methodType: MethodType;
  methods: Schema.Types.ObjectId;
}

const methodSchema: Schema = new Schema(
  {
    methodName: {
      type: String,
      default: "Rotación de Inventario",
      required: true,
    },
    methodType: {
      type: String,
      enum: Object.values(methodType),
      default: methodType.RI,
    },
    methods: {
      type: Schema.Types.ObjectId,
      ref: "Methods",
    },
  },
  { timestamps: true },
);

const MethodRI = mongoose.model<IMethodRI>("MethodRI", methodSchema);
export default MethodRI;
