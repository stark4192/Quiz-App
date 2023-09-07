const admin = require('firebase-admin');
const bcrypt = require('bcrypt');
const { initializeApp } = require('firebase/app');
//const Question = require('../model/Question');
//const Answer = require('../model/Answer');
//const UserResponse = require('../model/UserResponse');
const User = require('../model/model');
const axios = require('axios');

const { setPersistence, browserLocalPersistence,getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, getIdToken ,verifyIdToken} = require('firebase/auth');

const saltRounds = 10;

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDH-RkEX7AUAeEf0q7Tmhm4gJBMnGIF2-0",
  authDomain: "careercarveauth.firebaseapp.com",
  projectId: "careercarveauth",
  storageBucket: "careercarveauth.appspot.com",
  messagingSenderId: "115315760912",
  appId: "1:115315760912:web:f64f9ab5594bba707c4f95",
  measurementId: "G-LDVJSERWB1"
};

exports.api = async (req, res) => {
  const url = "https://api.catboys.com/catboy";

  try {
    const response = await axios.get(url);
    const jsonData = response.data;
    console.log(jsonData);
    res.status(200).send(jsonData);
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: 'An error occurred' });
  }
};

exports.welcome = async (req, res) => {
  res.status(200).send({success: true,
    message:"API successfully called"
  })
}

const app = initializeApp(firebaseConfig);
const auth = getAuth();

exports.signup = async (req, res) => {
  console.log(req.body);
  // Validate request
  if (!req.body) {
    res.status(400).send({ message: 'Content cannot be empty' });
    return;
  }

  const user = req.body;
  const userData = new User(user);

  try {

    const salt = await bcrypt.genSalt(saltRounds);
    const hashedPassword = await bcrypt.hash(user.password, salt);

    createUserWithEmailAndPassword(auth, user.email, user.password)
      .then(async (userCredential) => {
        // Signed in
        const user = userCredential.user;
        const token = await getIdToken(user);
        console.log(user);

        userData.password = hashedPassword;
        userData
          .save()
          .then((ref) => {
            console.log('User created with ID:', ref.id);
            res.status(200).json({ success: true,
              message: "Signed up successfully"
            });
          })
          .catch((error) => {
            console.error('Error creating user:', error);
            res.status(500)
              .json({ error: 'An error occurred while creating the user' });
          });
        
      })
      .catch((error) => {
        const errorMessage = error.message;
        console.log(errorMessage);
        res.status(500).send({ message: error });
      });
  } catch (err) {
    res.status(500).send({ message: 'Error creating user' });
  }
};



exports.signin = (req, res) => {
  console.log(req.body);
  if (!req.body) {
    res.status(400).send({ message: 'Content cannot be empty' });
    return;
  }

  const { email, password } = req.body;

  try{
    signInWithEmailAndPassword(auth,email, password)
    .then(async(userCredential) => {
      // User signed in successfully
      const user = userCredential.user;
      const token = await getIdToken(user);
      console.log(user);
      res.status(200).send({ success: true, message: "SignedIn Successfully",token: token});
      setPersistence(auth, browserLocalPersistence);
    })
    .catch((error) => {
      const errorMessage = error.message;
      console.log(errorMessage);
      res.status(401).send({ message: 'Invalid email or password'});
    });
}catch(err){
  res.status(500).send({ message: err });
  }
}



// exports.updatePhoneNumber = (req, res) => {
//   console.log(req.body);

//   // Validate the request
//   if (!req.body) {
//     res.status(400).send({ message: 'Content cannot be empty' });
//     return;
//   }

//   // const emailId = req.headers.authorization.email;
//   // emailId = emailId.split(' ')[1];
//   // const credentials = Buffer.from(emailId, 'base64').toString('ascii');
//   // const [username ,password] = credentials.split(':');


//   const phone_number = req.body.phone_number;

//   const token = req.headers.authorization;
//   let tk = token.split(' ')[1]
//   console.log(tk);
//   // Verify the token
//   admin
//     .auth()
//     .verifyIdToken(tk)
//     .then((decodedToken) => {
//       const uid = decodedToken.uid;
//       console.log(uid);
//       // newData =JSON.stringify({
//       //   phoneNumber:phoneNumber
//       // })
//       console.log(auth.currentUser.email)
//   //     console.log(decodedToken.uid)
//       // Update the phone number in the database
//       User.findOneAndUpdate(
//         {email: auth.currentUser.email}, 
//         {phone_number:phone_number},
//         {new: true}
//       )
//         .then((updatedUser) => {
//           if (!updatedUser) {
//             console.error('User not found');
//             res.status(404).send({ message: 'User not found' });
//             return;
//           }

//           console.log('Successfully updated user:', updatedUser);
//           res.status(200).send({success: true,
//             message: "Phone number changed / added successfully"
//             });
//         })
//         .catch((error) => {
//           console.error('Error updating user:', error);
//           res.status(500).send({ message: 'An error occurred while updating the user' });
//         });
//       })
//     .catch((error) => {
//       console.error('Error verifying token:', error);
//       res.status(401).send({ message: 'Invalid token' });
//     });
// };


// exports.submit =async(req,res)=>{
//   if (!req.body) {
//     res.status(400).send({ message: 'Content cannot be empty' });
//     return;
//   }
//   const token = req.headers.authorization;
//   let tk = token.split(' ')[1]
//   //console.log(tk);
//   // Verify the token
//   try{
//     admin
//     .auth()
//     .verifyIdToken(tk)
//     .then(()=>{console.log('Verified Account')})
//     .catch(()=>{console.log('User Invalid');return;})
//     const {userId, testId,questionId, answers } = req.body;    

//     const existingResponse = await UserResponse.findOne({ userId, testId });
//     if (existingResponse) {
//       return res.status(400).json({ message: 'User has already taken the test' });
//     }

//     const test = await Test.findOne({ testId });
//     if (!test) {
//       return res.status(404).json({ message: 'Test not found' });
//     }
//     let score = 0;
//     const userAnswers = req.body.answers;
//     userAnswers.forEach((userAnswer) => {
//       const question = test.questions.find((q) => q.questionId === userAnswer.questionId);
//       if (question) {
//         const correctAnswers = question.choices.filter((choice) => choice.isCorrect);
//         const userSelectedAnswers = userAnswer.selectedChoices;
    
//         const isCorrect = Array.isArray(userSelectedAnswers) && userSelectedAnswers.every((selectedAnswer) =>
//           correctAnswers.some((correctAnswer) => correctAnswer.choiceId === selectedAnswer)
//         );
    
//         if (isCorrect) {
//           score++;
//         }
//       }
//     });

//     // Store the user's response in the database
//     await UserResponse.create({ userId, testId, questionId, answers });

//     // Return the score to the user
//     res.json({ userId, testId, score });
//   } catch (error) {
//     console.error(error);
//     res.status(401).json({ message: "error" });
//   }
// };



