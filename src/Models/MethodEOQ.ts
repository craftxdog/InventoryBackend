import mongoose, { Schema, Document, Types } from "mongoose"

const methodType = {
  NTC: "",
  EOQ: "EOQ",
  CMC: "CMC",
  RI: "RI"

} as const

export type MethodType = typeof methodType[keyof typeof methodType]

export interface IMethodEOQ extends Document {
  methodName: string
  product: string
  methodType: MethodType
  description: string
  costoPedido: number,
  costoMantenimiento: number,
  demandaAnual: number
  result: number
  method: Types.ObjectId
}

const methodSchema: Schema = new Schema ({
  methodName: {
    type: String,
    default: 'Cantidad Económica de Pedido',
    required: true,
  },
  product: {
    type: String,
    required: true
  },
  methodType: {
    type: String,
    enum: Object.values(methodType),
    default: methodType.EOQ
  },
  costoPedido: {
    type: Number,
    required: true
  },
  costoMantenimiento: {
    type: Number,
    required: true
  },
  demandaAnual: {
    type: Number,
    required: true
  },
  result: {
    type: Number,
    default: 0
  },
  description: {
    type: String,
    required: true
  },
  method: {
    type: Types.ObjectId,
    ref: 'Method'
  }
}, { timestamps: true } )

const MethodEOQ = mongoose.model<IMethodEOQ>('MethodEOQ', methodSchema)
export default MethodEOQ
