// const Materials = require("./material.json");
// const fs = require("fs");

const createHttpError = require("http-errors");

// function getLevenshteinDistance(string1, string2) {
//   const matrix = Array(string1.length + 1)
//     .fill(null)
//     .map(() => Array(string2.length + 1).fill(null));

//   for (let i = 0; i <= string1.length; i++) {
//     matrix[i][0] = i;
//   }

//   for (let j = 0; j <= string2.length; j++) {
//     matrix[0][j] = j;
//   }

//   for (let i = 1; i <= string1.length; i++) {
//     for (let j = 1; j <= string2.length; j++) {
//       const indicator = string1[i - 1] === string2[j - 1] ? 0 : 1;
//       matrix[i][j] = Math.min(
//         matrix[i - 1][j] + 1,
//         matrix[i][j - 1] + 1,
//         matrix[i - 1][j - 1] + indicator
//       );
//     }
//   }

//   return matrix[string1.length][string2.length];
// }
// function calculateStringSimilarity(string1, string2) {
//   const maxLength = Math.max(string1.length, string2.length);
//   const distance = getLevenshteinDistance(string1, string2);
//   const similarity = (maxLength - distance) / maxLength;
//   const similarityPercentage = similarity * 100;

//   return similarityPercentage;
// }

// var duplicatedPair = [];

// const duplicatedPairUnfiltered = Materials.map((material) => {
//   const equivalent = Materials.find(
//     (x) =>
//       calculateStringSimilarity(
//         x.nome.toUpperCase(),
//         material.nome.toUpperCase()
//       ) > 97 && x._id != material._id
//   );
//   if (equivalent) {
//     return {
//       "MATERIAL 1": {
//         id: material._id,
//         nome: material.nome,
//         qtde: material.qtde,
//       },
//       "MATERIAL 2": {
//         id: equivalent._id,
//         nome: equivalent.nome,
//         qtde: equivalent.qtde,
//       },
//     };
//   } else return null;
// });
// const json = JSON.stringify(duplicatedPairUnfiltered);
// fs.writeFile("./duplicated.json", json, "utf8", function (err) {
//   if (err) {
//     return console.log(err);
//   }

//   console.log("The file was saved!");
// });

async function externalFunction() {
  try {
    const resp = await internalFunction(1);
    console.log(resp);
  } catch (error) {
    console.log("ERRO");
    if (createHttpError.isHttpError(error)) {
      console.log(error.message);
    }
    console.log(error);
  }
}

async function internalFunction(x) {
  if (x > 5) {
    setTimeout(() => {}, 1000);
    return "OK";
  } else throw new createHttpError.BadRequest("Número inválido.");
}
externalFunction();
