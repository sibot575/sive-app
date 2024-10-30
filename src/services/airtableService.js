// airtableService.js
const AIRTABLE_API_KEY = 'pattwwjlKDpYfeKfm.d7db18c30eee3bf6afff33c29e1c58b8ddfa2b7926a35acc057b8e1cf7bb5f3a';
const BASE_ID = 'appouiLmNKAwh3PmA';
const TABLE_NAME = 'appel_offre';

export const airtableConfig = {
  apiKey: AIRTABLE_API_KEY,
  baseId: BASE_ID,
  tableName: TABLE_NAME,
};

class AirtableService {
    constructor(config) {
      this.apiKey = config.apiKey;
      this.baseId = config.baseId;
      this.tableName = config.tableName;
      this.baseURL = `https://api.airtable.com/v0/${this.baseId}/${this.tableName}`;
    }
  
    async fetchRecords() {
      try {
        console.log('Démarrage de la récupération des données...'); // Debug
        
        // Construire l'URL avec les paramètres de tri et de limite
        const params = new URLSearchParams({
          'maxRecords': '50', // Limite à 50 enregistrements
          'sort[0][field]': 'Publication Date', // Tri par date de publication
          'sort[0][direction]': 'desc', // Ordre décroissant
          'view': 'Grid view' // Utilise la vue Grid par défaut
        });

        const url = `${this.baseURL}?${params.toString()}`;
        console.log('URL de requête:', url); // Debug

        const response = await fetch(url, {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json'
          },
          method: 'GET'
        });
  
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
  
        const data = await response.json();
        console.log('Données brutes reçues de Airtable:', data); // Debug
  
        if (!data.records || !Array.isArray(data.records)) {
          console.error('Format de données invalide:', data);
          return [];
        }
  
        const transformedRecords = data.records.map(record => {
          const fields = record.fields;
          return {
            id: record.id,
            title: fields.Title || 'Sans titre',
            link: fields.Link || '',
            publication_date: fields['Publication Date'] || '',
            deadline_date: fields['Deadline Date'] || '',
            image_url: fields['Image URL'] || '',
            source: fields.Source || '',
            pdf_links: fields.pdf_links || '',
            resume: fields.resume || '',
            status: fields.status || 'non_traite',
            status2: fields.status2 || 'non_traite',
            categorie: fields.categorie || 'non_categorise',
            status3: fields.status3 || 'non',
            email_sent: fields.email_sent || 'non',
            expiration: fields.expiration || 'non_expire',
            bitrix: fields.Bitrix || '',
            piece_jointe: fields['piece jointe'] || ''
          };
        });
  
        console.log('Données transformées:', transformedRecords); // Debug
        console.log(`Nombre d'enregistrements transformés: ${transformedRecords.length}`); // Debug
        return transformedRecords;
  
      } catch (error) {
        console.error('Erreur lors de la récupération des données:', error);
        throw new Error(`Erreur lors de la récupération des données: ${error.message}`);
      }
    }

    async createRecord(fields) {
      try {
        const response = await fetch(this.baseURL, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            records: [{
              fields: {
                'Title': fields.title,
                'Link': fields.link,
                'Publication Date': fields.publication_date,
                'Deadline Date': fields.deadline_date,
                'Image URL': fields.image_url,
                'Source': fields.source,
                'pdf_links': fields.pdf_links,
                'resume': fields.resume,
                'status': fields.status,
                'status2': fields.status2,
                'categorie': fields.categorie,
                'status3': fields.status3,
                'email_sent': fields.email_sent,
                'expiration': fields.expiration,
                'Bitrix': fields.bitrix,
                'piece jointe': fields.piece_jointe
              }
            }]
          })
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        console.log('Record créé avec succès:', result);
        return result;
      } catch (error) {
        console.error('Erreur lors de la création du record:', error);
        throw error;
      }
    }

    async updateRecord(recordId, fields) {
      try {
        const response = await fetch(`${this.baseURL}/${recordId}`, {
          method: 'PATCH',
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            fields: {
              'Title': fields.title,
              'Link': fields.link,
              'Publication Date': fields.publication_date,
              'Deadline Date': fields.deadline_date,
              'Image URL': fields.image_url,
              'Source': fields.source,
              'pdf_links': fields.pdf_links,
              'resume': fields.resume,
              'status': fields.status,
              'status2': fields.status2,
              'categorie': fields.categorie,
              'status3': fields.status3,
              'email_sent': fields.email_sent,
              'expiration': fields.expiration,
              'Bitrix': fields.bitrix,
              'piece jointe': fields.piece_jointe
            }
          })
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        console.log('Record mis à jour avec succès:', result);
        return result;
      } catch (error) {
        console.error('Erreur lors de la mise à jour du record:', error);
        throw error;
      }
    }

    async deleteRecord(recordId) {
      try {
        const response = await fetch(`${this.baseURL}/${recordId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
          }
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        console.log('Record supprimé avec succès:', result);
        return result;
      } catch (error) {
        console.error('Erreur lors de la suppression du record:', error);
        throw error;
      }
    }
}

export const airtableService = new AirtableService(airtableConfig);