const Post = require('./models/post.model');
require('./config/MongoDB');




// for or query
// { $or: [{Report.fraud_number: { $gt: 0 }}, {Report.already_donated_number: { $gt: 0 }}] }



// not completely done
async function deleteData() {
  const posts = await Post.find({ $or: [{"Report.fraud_number": { $gt: 3 }}, {"Report.already_donated_number": { $gt: 3 }},{"Report.other": { $gt: 3 }}] });
  if (posts.length) {
    for (const post of posts) {
      try {
        await post.remove();
        console.log(`successfully deleted ${post}`);
      } catch (error) {
        console.log(`error while deleting file ${error}`);
      }
    }
    console.log('Done job for this time');
  }
}

deleteData().then(process.exit);
