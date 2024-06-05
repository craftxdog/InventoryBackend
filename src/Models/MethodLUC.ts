import mongoose, { Schema, Document } from "mongoose";
import { MethodType, methodType } from "../Utils/methodType";

export interface IMethodLUC extends Document {
  methodName: string;
  methodType: MethodType;
  semanas: number;
  periodo: number;
  unidades: number;
  S: number;
  K: number;
  costoTotal: number;
  costoUnitarioTotal: number;
  requerimientoBruto: number;
  recepcionPlaneada: number;
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
      default: methodType.LUC,
    },
    periodo: { type: Number, required: true },
    unidades: { type: Number, required: true },
    S: { type: Number, required: true },
    K: { type: Number, required: true },
    costoTotal: { type: Number, required: true },
    costoUnitarioTotal: { type: Number, required: true },
    requerimientoBruto: { type: Number, required: true },
    recepcionPlaneada: { type: Number, required: true },
    methods: {
      type: Schema.Types.ObjectId,
      ref: "Methods",
    },
  },
  { timestamps: true },
);

const MethodLUC = mongoose.model<IMethodLUC>("MethodLUC", methodSchema);
export default MethodLUC;
