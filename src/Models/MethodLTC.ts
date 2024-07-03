import mongoose, { Schema, Document } from "mongoose";
import { MethodType, methodType } from "../Utils/methodType";

export interface IMethodLTC extends Document {
  methodName: string;
  methodType: MethodType;
  semanas: number;
  periodo: number[];
  unidades: number[];
  S: number;
  K: number;
  kvalores: number[];
  costoTotal: number[];
  costoUnitarioTotal: number[];
  requerimientoBruto: number[];
  recepcionPlaneada: number[];
  methods: Schema.Types.ObjectId;
}

const methodSchema: Schema = new Schema(
  {
    methodName: {
      type: String,
      default: "Costo Unitario Mínimo",
      required: true,
    },
    methodType: {
      type: String,
      enum: Object.values(methodType),
      default: methodType.LUC,
    },
    semanas: { type: Number, required: true },
    periodo: { type: [Number], required: true },
    unidades: { type: [Number], required: true },
    S: { type: Number, required: true },
    K: { type: Number, required: true },
    kvalores: { type: [Number], required: true },
    costoTotal: { type: [Number], required: true },
    costoUnitarioTotal: { type: [Number], required: true },
    requerimientoBruto: { type: [Number], required: true },
    recepcionPlaneada: { type: [Number], required: true },
    methods: {
      type: Schema.Types.ObjectId,
      ref: "Methods",
    },
  },
  { timestamps: true },
);

const MethodLTC = mongoose.model<IMethodLTC>("MethodLTC", methodSchema);
export default MethodLTC;
