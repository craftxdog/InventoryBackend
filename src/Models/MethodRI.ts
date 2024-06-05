import mongoose, { Schema, Document } from "mongoose";
import { MethodType, methodType } from "../Utils/methodType";

export interface IMethodRI extends Document {
  methodName: string;
  methodType: MethodType;
  demandaAnual: number;
  cantidadPedido: number;
  inventarioSeguridad: number;
  valorSemanas: number;
  cicloRevision: number;
  valorPromedio: number;
  rotacionInventario: number;
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
    demandaAnual: {
      type: Number,
      required: true,
      default: 0,
    },
    cantidadPedido: {
      type: Number,
      default: 0,
    },
    inventarioSeguridad: {
      type: Number,
      default: 0,
      required: true,
    },
    valorSemanas: {
      type: Number,
      default: 0,
    },
    cicloRevision: {
      type: Number,
      default: 0,
    },
    valorPromedio: {
      type: Number,
      default: 0,
    },
    rotacionInventario: {
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

const MethodRI = mongoose.model<IMethodRI>("MethodRI", methodSchema);
export default MethodRI;
