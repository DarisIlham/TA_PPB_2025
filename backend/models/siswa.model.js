// siswa.model.js
import mongoose from "mongoose";
import { Schema } from "mongoose";
import AutoIncrementFactory from "mongoose-sequence";

// Pass mongoose to plugin
const AutoIncrement = AutoIncrementFactory(mongoose);

const siswaSchema = new Schema(
  {
    nama: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100
    },
    kelas: {
      type: String,
      required: true,
      trim: true,
      maxlength: 20
    },
    nisn: {
      type: Number,
      required: true,
      unique: true,
      validate: {
        validator: function(v) {
          return /^\d{10}$/.test(v.toString());
        },
        message: props => `${props.value} is not a valid 10-digit NISN!`
      }
    },
  },
  { timestamps: true }
);

// Add auto-increment ID if needed
siswaSchema.plugin(AutoIncrement, { inc_field: 'siswa_id' });

export default mongoose.model("Siswa", siswaSchema);