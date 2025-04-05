const fs = require('fs');
const path = require('path');
const { google } = require('googleapis');
const { authorize } = require('./auth');
require('dotenv').config({ path: path.resolve(__dirname, '../../../../.env') });

const upgradedPath = path.resolve(__dirname, '../../output/upgraded-docs-preview.json');
const originalPath = path.resolve(__dirname, '../../assets/generated-docs-patched.json');

const upgradedDocs = JSON.parse(fs.readFileSync(upgradedPath));
const originalDocs = JSON.parse(fs.readFileSync(originalPath));

async function clearAndInsertDoc(docId, newContent) {
  const auth = await authorize();
  const docs = google.docs({ version: 'v1', auth });

  // Step 1: Get current content
  const currentDoc = await docs.documents.get({ documentId: docId });
  const contentLength = currentDoc.data.body.content.length;

  // Step 2: Delete everything (except 1 root element)
  const deleteRequest = {
    documentId: docId,
    resource: {
      requests: [
        {
          deleteContentRange: {
            range: {
              startIndex: 1,
              endIndex: contentLength
            }
          }
        }
      ]
    }
  };
  await docs.documents.batchUpdate(deleteRequest);

  // Step 3: Insert new content
  const insertRequest = {
    documentId: docId,
    resource: {
      requests: [
        {
          insertText: {
            location: {
              index: 1
            },
            text: newContent
          }
        }
      ]
    }
  };
  await docs.documents.batchUpdate(insertRequest);
  console.log(`📄 Synced content to Doc: https://docs.google.com/document/d/${docId}/edit`);
}

(async () => {
  const upgraded = upgradedDocs[0];
  const match = originalDocs.find(d => d.title === upgraded.pageTitle);

  if (!match || !match.docId) {
    console.error('❌ Could not find matching docId for:', upgraded.pageTitle);
    process.exit(1);
  }

  await clearAndInsertDoc(match.docId, upgraded.aiContent);
})();
