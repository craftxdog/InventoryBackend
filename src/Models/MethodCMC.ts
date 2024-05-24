import mongoose, { Document, Schema, Types } from 'mongoose';

const methodType = {
  NULL: "",
  EOQ: "EOQ",
  CMC: "CMC",
  RI: "RI"

} as const

export type MethodType = typeof methodType[keyof typeof methodType]


export interface IMethodCMC extends Document {
  methodName: string
  methodType: MethodType
  horas: number
  MTBF: number
  duracionTarea: number
  costoHoraTrabajo: number
  repuestos: number,
  costoTareasOperacionales: number
  retrasoLogistico: number
  costoUnitarioParada: number
  costosFallaVezUnica: number
  numeroFallas: number
  costoTotal: number
  method: Types.ObjectId
}

const methodSchema: Schema = new Schema ({
  methodName: {
    type: String,
    default: 'Costo de Mantenimiento Correctivo',
    required: true,
  },
  methodType: {
    type: String,
    enum: Object.values(methodType),
    default: methodType.CMC
  },
  horas: {
    type: Number,
    required: true,
  },
  MTBF: {
    type: Number,
    required: true,
  },
  duracionTarea: {
    type: Number,
    required: true,
  },
  costoHoraTrabajo: {
    type: Number,
    required: true,
  },
  repuestos: {
    type: Number,
    required: true,
  },
  costoTareasOperacionales: {
    type: Number,
    required: true,
  },
  retrasoLogistico: {
    type: Number,
    default: 0
  },
  costoUnitarioParada: {
    type: Number,
    required: true,
  },
  costosFallaVezUnica: {
    type: Number,
    required: true,
  },
  numeroFallas: {
    type: Number,
    required: true,
  },
  costoTotal: {
    type: Number,
    required: true,
  },
  method: {
    type: Types.ObjectId,
    ref: 'Method'
  }

}, { timestamps: true })

const MethodCMC = mongoose.model<IMethodCMC>('MethodCMC', methodSchema)
export default MethodCMC
