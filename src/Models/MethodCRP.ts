import mongoose, { Schema, Document } from "mongoose";
import { MethodType, methodType } from "../Utils/methodType";

export interface IMethodCRP extends Document {
  methodName: string;
  methodType: MethodType;
  tasaDemanda: number;
  tiempoVuelta: number;
  tamanoRecipiente: number;
  cantidadRecipiente: number;
  invenMax: number;
  methods: Schema.Types.ObjectId;
}

const methodSchema: Schema = new Schema(
  {
    methodName: {
      type: String,
      default: "Cantidad de Recipientes",
      required: true,
    },
    methodType: {
      type: String,
      enum: Object.values(methodType),
      default: methodType.CRP,
    },
    tasaDemanda: {
      type: Number,
      required: true,
    },
    tiempoVuelta: {
      type: Number,
      required: true,
    },
    tamanoRecipiente: {
      type: Number,
      required: true,
    },
    cantidadRecipiente: {
      type: Number,
      default: 0,
    },
    invenMax: {
      type: Number,
      default: 0,
    },
    methods: {
      type: Schema.Types.ObjectId,
      ref: "Methods",
    },
  },
  { timestamps: true },
);

const MethodCRP = mongoose.model<IMethodCRP>("MethodCRP", methodSchema);
export default MethodCRP;
