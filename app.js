const path = require('path');
const NodeGoogleDrive = require('node-google-drive')
const fs = require('fs');
const { Client, MessageAttachment } = require('discord.js');

const client = new Client();

const compatibleMIME = [
  {extension : 'jpeg', mimeType : 'image/jpeg'}, 
  {extension : 'png', mimeType : 'image/png'}, 
  {extension : 'svg', mimeType : 'image/svg+xml'}, 
]
const IMG_STORE = './tmp';
const YOUR_ROOT_FOLDER = '1MpeHXsy20DorU3BbhLm0__eBoVPYxVl4',
  PATH_TO_CREDENTIALS = path.resolve(`${__dirname}/my_credentials.json`);

client.on('ready', () => {
  console.log('I am ready!');
});

client.on('message', async message => {
  // If the message is '!rip'
  if (message.content.startsWith('!picord')) {
    const commands = message.content.split(" ")
    if (commands.length < 2) {
      message.channel.send("Please enter what you want to see");
    }
    const command = commands[1]
    if (command === "help") {
      message.channel.send("This is Picord Bot\n!picord - Help\n!picord [name] - Get a random picture of [name]");
      return
    }
    // Create the attachment using MessageAttachment
    const img = await getRandomImage(command)
    if (!img) {
      message.channel.send("Invalid Path");
      return 
    }

    const attachment = new MessageAttachment(img);
    await message.channel.send(attachment);
    fs.unlinkSync(img)
    // Send the attachment in the message channel
  }
});

client.login('NzQxMDMxMjI4OTU3OTE3MjE1.XyxpHA.FJu3CdkofdlLAXlDOnq8t98tfSk');

// Let's wrap everything in an async function to use await sugar
async function getRandomImage(name) {
	const creds_service_user = require(PATH_TO_CREDENTIALS);

	const googleDriveInstance = new NodeGoogleDrive({
		ROOT_FOLDER: YOUR_ROOT_FOLDER
	});

	let gdrive = await googleDriveInstance.useServiceAccountAuth(
		creds_service_user
	);

	// List Folders under the root folder
	let folderResponse = await googleDriveInstance.listFolders(
		YOUR_ROOT_FOLDER,
		null,
		false
  );
  
  const folders = folderResponse.folders.filter(f => f.name === name);
  
  if (!folders.length) {
    return null
    // let newFolder = { name },
		// createFolderResponse = await googleDriveInstance.createFolder(
		// 	YOUR_ROOT_FOLDER,
		// 	newFolder.name
    // );
    
    // fId = createFolderResponse.id
  }
  let fId = folders[0].id;

  console.log(fId)
  folderResponse = await googleDriveInstance.listFiles(
		fId,
		null,
		false
  );

  const pictures = folderResponse.files.filter(f => compatibleMIME.some(c => c.mimeType === f.mimeType))
  if (!pictures.length) {
    return null
  }

  const pic = pictures[getRandomInt(pictures.length)]
  console.log(pic)

  if (!fs.existsSync(IMG_STORE)){
    fs.mkdirSync(IMG_STORE);
  }
  
  const d = await googleDriveInstance.getFile(
		pic,
		IMG_STORE,
		null
  );

  console.log(d)
  return d
  // const pictures = 

	// Create a folder under your root folder
	// let newFolder = { name: 'folder_example' + Date.now() },
	// 	createFolderResponse = await googleDriveInstance.createFolder(
	// 		YOUR_ROOT_FOLDER,
	// 		newFolder.name
	// 	);

	// newFolder.id = createFolderResponse.id;

	// console.log(`Created folder ${newFolder.name} with id ${newFolder.id}`);

	// // List files under your root folder.
	// let listFilesResponse = await googleDriveInstance.listFiles(
	// 	YOUR_ROOT_FOLDER,
	// 	null,
	// 	false
	// );

	// for (let file of listFilesResponse.files) {
	// 	console.log({ file });
	// }
}

getRandomImage("Jimin");

// Exclusive Max
function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}


// const fs = require('fs');
// const readline = require('readline');
// const {google} = require('googleapis');
// const APP_DIR = "Picord"

// // If modifying these scopes, delete token.json.
// const SCOPES = ['https://www.googleapis.com/auth/drive'];
// // The file token.json stores the user's access and refresh tokens, and is
// // created automatically when the authorization flow completes for the first
// // time.
// const TOKEN_PATH = 'token.json';

// // Load client secrets from a local file.
// fs.readFile('credentials.json', (err, content) => {
//   if (err) return console.log('Error loading client secret file:', err);
//   // Authorize a client with credentials, then call the Google Drive API.
//   // authorize(JSON.parse(content), listFiles);
//   authorize(JSON.parse(content), (drive) => createFolder(APP_DIR, drive, (drive, file) => getPictures(drive,file, "Seiya")));
// });


// /**
//  * Create an OAuth2 client with the given credentials, and then execute the
//  * given callback function.
//  * @param {Object} credentials The authorization client credentials.
//  * @param {function} callback The callback to call with the authorized client.
//  */
// function authorize(credentials, callback) {
//   const {client_secret, client_id, redirect_uris} = credentials.installed;
//   const oAuth2Client = new google.auth.OAuth2(
//       client_id, client_secret, redirect_uris[0]);

//   // Check if we have previously stored a token.
//   fs.readFile(TOKEN_PATH, (err, token) => {
//     if (err) return getAccessToken(oAuth2Client, callback);
//     oAuth2Client.setCredentials(JSON.parse(token));
//     callback(oAuth2Client);
//   });
// }

// /**
//  * Get and store new token after prompting for user authorization, and then
//  * execute the given callback with the authorized OAuth2 client.
//  * @param {google.auth.OAuth2} oAuth2Client The OAuth2 client to get token for.
//  * @param {getEventsCallback} callback The callback for the authorized client.
//  */
// function getAccessToken(oAuth2Client, callback) {
//   const authUrl = oAuth2Client.generateAuthUrl({
//     access_type: 'offline',
//     scope: SCOPES,
//   });
//   console.log('Authorize this app by visiting this url:', authUrl);
//   const rl = readline.createInterface({
//     input: process.stdin,
//     output: process.stdout,
//   });
//   rl.question('Enter the code from that page here: ', (code) => {
//     rl.close();
//     oAuth2Client.getToken(code, (err, token) => {
//       if (err) return console.error('Error retrieving access token', err);
//       oAuth2Client.setCredentials(token);
//       // Store the token to disk for later program executions
//       fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
//         if (err) return console.error(err);
//         console.log('Token stored to', TOKEN_PATH);
//       });
//       callback(oAuth2Client);
//     });
//   });
// }

// function createFolder(name, auth, cb) {
//   const drive = google.drive({version: 'v3', auth});
  
//   var fileMetadata = {
//     'name': name,
//     'mimeType': 'application/vnd.google-apps.folder'
//   };

//   drive.files.list({
//     q: "name = " + '\'' + name + '\'' +' and mimeType = \'application/vnd.google-apps.folder\'',
//     fields: 'nextPageToken, files(id, name, parents)',
//   }, (err, res) => {
//     if (err) return console.log('The API returned an error: ' + err);
//     const files = res.data.files;
//     var file = {}
//     if (!files.length) {
//       drive.files.create({
//         resource: fileMetadata,
//         fields: 'id'
//       }, function (err, f) {
//         if (err) {
//           // Handle error
//           console.error(err);
//         } else {
//           file = f
//           console.log('Folder Id: ', file.id);
//         }
//       });
//     } else {
//       file = files[0]
//     }
//     console.log(files)
//     console.log(file)
//     cb(drive, file)
//   })
// }
// // /**
// //  * Lists the names and IDs of up to 10 files.
// //  * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
// //  */
// // function listFiles(auth) {
// //   const drive = google.drive({version: 'v3', auth});
// //   drive.files.list({
// //     pageSize: 10,
// //     fields: 'nextPageToken, files(id, name)',
// //   }, (err, res) => {
// //     if (err) return console.log('The API returned an error: ' + err);
// //     const files = res.data.files;
// //     if (files.length) {
// //       console.log('Files:');
// //       files.map((file) => {
// //         console.log(`${file.name} (${file.id})`);
// //       });
// //     } else {
// //       console.log('No files found.');
// //     }
// //   });
// // }

// function getPictures(drive, file, name) {
//   drive.files.list({
//     q: '\'' + file.id + '\'' + ' in parents and name = ' + '\'' + name + '\'',
//     fields: 'nextPageToken, files(id, name)',
//   }, (err, res) => {
//     if (err) return console.log('The API returned an error: ' + err);
//     const files = res.data.files;
//     console.log(files)
//     if (!files.length) {
//       var fileMetadata = {
//         'name': name,
//         'mimeType': 'application/vnd.google-apps.folder',
//         'parents': [file.id]
//       };
//       drive.files.create({
//         resource: fileMetadata,
//         fields: 'id'
//       }, function (err, f) {
//         if (err) {
//           // Handle error
//           console.error(err);
//         } else {
//           file = f
//           console.log('Folder Id: ', file.id);
//         }
//       });
//     } else {
//       file = files[0]
//     }
//     console.log(files)
//     console.log(file)
//   })
// }