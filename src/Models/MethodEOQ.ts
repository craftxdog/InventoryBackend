import mongoose, { Schema, Document } from "mongoose";
import { MethodType, methodType } from "../Utils/methodType";

export interface IMethodEOQ extends Document {
  methodName: string;
  methodType: MethodType;
  costoPedido: number;
  costoMantenimiento: number;
  demandaAnual: number;
  result: number;
  methods: Schema.Types.ObjectId;
}

const methodSchema: Schema = new Schema(
  {
    methodName: {
      type: String,
      default: "Cantidad Económica de Pedido",
      required: true,
    },
    methodType: {
      type: String,
      enum: Object.values(methodType),
      default: methodType.EOQ,
    },
    costoPedido: {
      type: Number,
      required: true,
    },
    costoMantenimiento: {
      type: Number,
      required: true,
    },
    demandaAnual: {
      type: Number,
      required: true,
    },
    result: {
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

const MethodEOQ = mongoose.model<IMethodEOQ>("MethodEOQ", methodSchema);
export default MethodEOQ;
