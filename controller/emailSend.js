const sendEmailReport = require("../models/sendEmailReport");
const client = require("../models/client");
const {
  actionOnError,
  message_Response,
  AddedByOrEditedBy,
} = require("../config/helper");
const axios = require("axios");
const dotenv = require("dotenv");
const { default: mongoose } = require("mongoose");
dotenv.config();
const Event = require("../models/Event");

exports.sendEmail = async (req, res) => {
  try {
    let { sendTo, subject, textBody } = req.body;
    let emailToSend = [];
    let clientId = [];

    if (!sendTo.length) {
      return message_Response(res, 400, "Required", "client Id", false);
    }

    for (let a = 0; a < sendTo.length; a++) {
      if (!mongoose.isValidObjectId(sendTo[a])) {
        return message_Response(
          res,
          400,
          "InvalidField",
          `Client Id ${sendTo[a]}`,
          false
        );
      }

      let isClient = await client.findById(sendTo[a]).lean();

      if (!isClient) {
        return message_Response(
          res,
          404,
          NOT_FIND_ERROR,
          "client",
          false,
          null
        );
      }
      // sendTo.splice(a,1,isClient.email);
      else {
        clientId.push(isClient._id.toString());
        emailToSend.push(isClient.email);
      }
    }

    if (!subject || subject == "") {
      return message_Response(res, 400, "Required", "subject", false);
    }
    if (!textBody || textBody == "") {
      return message_Response(res, 400, "Required", "textBody", false);
    }

    let data = JSON.stringify({
      api_key: process.env.API_KEY,
      sender: "client@hbwebsol.com",
      to: emailToSend,
      subject: subject,
      text_body: textBody,
    });

    let config = {
      method: "post",
      url: "https://api.smtp2go.com/v3/email/send",
      headers: {
        "Content-Type": "application/json",
      },
      data: data,
    };

    const response = await axios.request(config);

    if (response.data) {
      let addedBy = AddedByOrEditedBy(req, "add");

      let data = new sendEmailReport({
        sendTo: emailToSend,
        subject,
        textBody,
        from: "client@hbwebsol.com",
        date: new Date(),
        status: "submitted",
        requestId: response.data.request_id,
        responce: response.data,
        addedBy,
        clientId,
      });

      data
        .save()
        .then((saved) => {
          console.log("Send report saved", saved);
        })
        .catch(() => {
          console.log("Send report not saved");
        });
    }
    return res.status(200).send({ status: true, responce: response.data });
  } catch (error) {
    actionOnError(error);
    return message_Response(res, 500, "SERVER_ERROR", "", false);
  }
};

exports.EventSave = async (req, res) => {
  try {
    // let today = new Date() // Current date and time
    // today.setUTCHours(0, 0, 0, 0); // Set time to 12:00 AM

    // let previousDay = new Date(today);
    // previousDay.setUTCDate(today.getUTCDate() - 1); // Subtract 1 day
    // previousDay.toISOString();

    let start_date = "2023-08-30T00:00:00.000Z";
    let end_date = "";

    if (req) {
      start_date = req.body.from;
      end_date = req.body.to || "";
    }

    let data = JSON.stringify({
      api_key: process.env.API_KEY,
      start_date,
      end_date,
    });

    let config = {
      method: "post",
      url: "https://api.smtp2go.com/v3/activity/search",
      headers: {
        "Content-Type": "application/json",
      },
      data: data,
    };

    const response = await axios.request(config);

    if (response.data) {
      let savedEvents = await Event.insertMany(response.data.data.events);

      if (req)
        return res.status(200).send({ status: true, responce: savedEvents });
    }
  } catch (err) {
    actionOnError(err);
    if (req != "undefined")
      return message_Response(res, 500, "SERVER_ERROR", "", false);
  }
};

exports.getSendEmailReport = async (req, res) => {
  try {
    let { from, to } = req.body;

    if (!from || from == "") {
      return message_Response(res, 400, "Required", "from", false);
    }
    if (to == "") {
      return message_Response(res, 400, "Required", "to", false);
    }

  let   fromDate = new Date(from + "T00:00:00Z");
  let  toDate = new Date(to + "T00:00:00Z");

   if(!to){
    toDate = new Date();
   }

  // let getEmailData = await sendEmailReport.find({date:{$gte: fromDate,$lte: toDate}}).select({'__v':0,"responce":0,"requestId":0});

    let aggregation = [
  {
    $match: {
      date: {
        $gte: fromDate,
        $lte: toDate,
      },
    },
  },
  {
    $addFields: {
      clientId: {
        $map: {
          input: "$clientId",
          as: "clientIds",
          in: { $toObjectId: "$$clientIds" },
        },
      },
    },
  },
  {
    $lookup: {
      from: "clients",
      localField: "clientId",
      foreignField: "_id",
      as: "clientdata",
    },
  },

  {
    $addFields: {
      clientNames: {
        $map: {
          input: "$clientdata",
          as: "client",
          in: "$$client.companyName",
        },
      },
    },
  },
  {
    $project: {
      __v: 0,
      responce: 0,
      requestId: 0,
      clientId: 0,
      clientdata: 0,
    },
  }
]
    const getEmailData = await sendEmailReport.aggregate(aggregation);

    return res.status(200).send({ status: true, responce: getEmailData });
  } catch (error) {
    actionOnError(error);
    return message_Response(res, 500, "SERVER_ERROR", "", false);
  }
};


exports.getsendEmailReportPerClient = async(req,res)=>{
try{

let clientId = req.params.clientId;
let fromDate;
let toDate = new Date();

      if(!clientId){
        return message_Response(res, 400, "Required", "from", false);
      }
      if (!mongoose.isValidObjectId(clientId)) {
        return message_Response(
          res,
          400,
          "InvalidField",
          `Client Id ${clientId}`,
          false
        );
      }
      if(Object.keys(req.body).length){
        from = req.body.from;
        to = req.body.to;
        fromDate = new Date(from + "T00:00:00Z");
        toDate = new Date(to + "T00:00:00Z");

}

if(!from){
  fromDate = new Date("2023-08-20T00:00:00Z")
}

 let aggregration = [
    {
      $match: {
        $and: [
          {
            clientId: { $elemMatch: { $eq: clientId } }
          },
          {
            date: {
              $gte: fromDate,
              $lte: toDate
            }
          }
        ]
       },  
      },
      {
$project:{
  responce:0,
  requestId:0
}
}          
 ]


let clientSendEmailHistory = await sendEmailReport.aggregate(aggregration);

return res.status(200).send({ status: true, responce: clientSendEmailHistory });

}catch(error){
  actionOnError(error);
  return message_Response(res, 500, "SERVER_ERROR", "", false);
}
}


// let data = JSON.stringify({
//   "api_key": "api-13E8C4F6428911EE9300F23C91C88F4E",
//   "sender": "client@hbwebsol.com",
//   "to": [
//     "husain.sanwerwala@hbwebsol.com"
//   ],
//   "subject": "Test Subject",
//   "text_body": "Test Body"
// });

// let config = {
//   method: 'post',
//   url: 'https://api.smtp2go.com/v3/email/send',
//   headers: {
//     'Content-Type': 'application/json'
//   },
//   data : data
// };

// axios.request(config)
// .then((response) => {
//   console.log(JSON.stringify(response.data));
// })
// .catch((error) => {
//   console.log(error);
// });

// exports.sendMail = async (req, res) => {
//   try {
//     let { to, subject, body } = req.body;

//     let success = [];
//     let unSuccess = [];

//                 to.map((to) => {
//                   transporter = nodemailer.createTransport({
//                     service: "gmail",
//                     auth: {
//                       user: "hameshaaavaj@gmail.com",
//                       pass: "ogesziicemcnhliq",
//                     },
//                   });

//                   const mailOptions = {
//                     from: "hameshaaavaj@gmail.com",
//                     to: to,
//                     subject: subject,
//                     text:body,
//                   };

//                   transporter.sendMail(mailOptions, async (error, info) => {
//                     if (error) {

//                           unSuccess.push(to);
//                           console.log("Error occurred:", error);

//                     } else {

//               let createdReport = await sendEmailReport.create({sendTo:to,sentBy:req.user._id,date:Date.now(),status:"send"})
//               if(createdReport) success.push(createdReport);

//                 console.log("Email sent:", info.response);

//                     }

//                   });
//                 });

//     return res.status(200).send({ status: true, success, unSuccess });

//   }
//   catch (error) {

//         actionOnError(error);
//         return message_Response(res, 500, "SERVER_ERROR", "", false);

//   }
// };

// exports.sendEmailUsingSMTP2GO = async (req, res) => {
//   try {
//     const smtp2goApiKey = "api-13E8C4F6428911EE9300F23C91C88F4E";

//     const emailData = {
//       api_key: smtp2goApiKey,
//       sender: "client@hbwebsol.com",
//       to: ["shivam.gupta@hbwebsol.com"],
//       subject: "subject",
//       html_body: "<html><body><p>HTML</p></body></html>",
//     };

//     const response = await axios.post('https://api.smtp2go.com/v3/email/send', JSON.stringify(emailData), {
//       headers: {
//         'Content-Type': 'application/json',
//       },
//     });

//     console.log('Email sent successfully:', response.data);
//     res.status(200).json({ message: 'Email sent successfully' });

//   } catch (error) {
//     console.error('Error sending email:', error.data);
//     res.status(500).json({ error});
//   }
//

// let today = new Date() // Current date and time
// today.setUTCHours(0, 0, 0, 0); // Set time to 12:00 AM

// let previousDay = new Date(today);
// previousDay.setUTCDate(today.getUTCDate() - 1); // Subtract 1 day
// previousDay.toISOString();
