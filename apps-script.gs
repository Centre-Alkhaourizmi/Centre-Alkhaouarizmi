/**
 * Centre Alkhaouarizmi — réception des inscriptions de la landing page.
 *
 * DÉPLOIEMENT (3 étapes)
 * 1. Ouvrez la Google Sheet destinataire > Extensions > Apps Script, collez ce fichier et enregistrez.
 * 2. Déployer > Nouveau déploiement > type « Application web » : Exécuter en tant que « Moi »,
 *    Qui a accès « Tout le monde » > Déployer, puis autorisez l'accès au compte Google.
 * 3. Copiez l'URL qui se termine par /exec et collez-la dans la constante SCRIPT_URL de index.html.
 *    (Après toute modification de ce fichier : Déployer > Gérer les déploiements > Modifier > Version « Nouvelle ».)
 */

var SHEET_NAME = 'Inscriptions';
var HEADERS = ['Date', 'Nom', 'Niveau', 'Téléphone', 'Matière', 'Message'];

/** Reçoit le POST du formulaire (FormData) et ajoute une ligne. */
function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.waitLock(30000);

  try {
    var p = (e && e.parameter) || {};
    var sheet = getSheet_();

    sheet.appendRow([
      new Date(),
      String(p.nom || '').trim(),
      String(p.niveau || '').trim(),
      "'" + String(p.telephone || '').trim(), // apostrophe = garde le 0 initial
      String(p.matiere || '').trim(),
      String(p.message || '').trim()
    ]);

    return jsonOutput_({ result: 'success' });
  } catch (err) {
    return jsonOutput_({ result: 'error', message: String(err) });
  } finally {
    lock.releaseLock();
  }
}

/** Permet de vérifier dans le navigateur que le Web App répond. */
function doGet() {
  return jsonOutput_({ result: 'ok', service: 'Centre Alkhaouarizmi — inscriptions' });
}

/** Retourne la feuille « Inscriptions », en la créant (avec ses en-têtes) si besoin. */
function getSheet_() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(SHEET_NAME);

  if (!sheet) {
    var all = ss.getSheets();
    // Classeur neuf (un seul onglet) : on le renomme au lieu d'en créer un second.
    sheet = (all.length === 1) ? all[0].setName(SHEET_NAME) : ss.insertSheet(SHEET_NAME);
  }

  if (sheet.getLastRow() === 0) {
    sheet.appendRow(HEADERS);
  }

  // Mise en forme de la ligne d'en-tête, appliquée une seule fois.
  if (sheet.getFrozenRows() === 0) {
    sheet.getRange(1, 1, 1, HEADERS.length)
         .setFontWeight('bold')
         .setBackground('#1657F0')
         .setFontColor('#FFFFFF');
    sheet.setFrozenRows(1);
    sheet.setColumnWidth(1, 160);
    sheet.setColumnWidth(6, 320);
  }

  return sheet;
}

function jsonOutput_(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
