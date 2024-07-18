import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const Schema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  title: {
    type: String,
  },
  description: {
    type: String,
  },
  questions: {
    type: Array,
  },
  invites: {
    type: Array,
  },
  public: {
    type: Boolean,
  },
  createdAt: {
    type: Number,
  },
  updateAt: {
    type: Number,
  },
},
{
    timestamps: {
      currentTime: () => Math.floor(Date.now() / 1000),
    }, strict: false,
  }
);

Schema.plugin(mongoosePaginate);

Schema.virtual("answers",{
  ref: "Answer", // Nama model yang ingin direlasikan
  localField: "_id", // _id yang ada di model form
  foreignField: "formId" // formId yang ada di model answer
})

export default mongoose.model("Form", Schema);

