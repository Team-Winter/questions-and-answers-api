const answerSchema = new Schema({
  id: Number,
  body: String,
  date: Date,
  answerer_name: String,
  helpfulness: Number
  photos: [{ url: String }]
})

const questionSchema = new Schema({
  id: Number,
  body: String,
  date: Date,
  asker_name: String,
  helpfulness: Number,
  reported: Boolean,
  product_id: Number,
  answers: [answerSchema]
})