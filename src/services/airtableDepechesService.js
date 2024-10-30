// airtableDepechesService.js
const AIRTABLE_API_KEY = 'pattwwjlKDpYfeKfm.d7db18c30eee3bf6afff33c29e1c58b8ddfa2b7926a35acc057b8e1cf7bb5f3a';
const BASE_ID = 'appouiLmNKAwh3PmA';
const TABLE_NAME = 'SIVE_ALERTE_ABJ_NET';

export const airtableConfig = {
  apiKey: AIRTABLE_API_KEY,
  baseId: BASE_ID,
  tableName: TABLE_NAME,
};

// Constantes pour les statuts
const STATUS = {
  LU: 'lu',
  NON_LU: 'non_lu'
};

class AirtableDepechesService {
    constructor(config) {
      this.apiKey = config.apiKey;
      this.baseId = config.baseId;
      this.tableName = config.tableName;
      this.baseURL = `https://api.airtable.com/v0/${this.baseId}/${this.tableName}`;
    }
  
    async fetchDepeches() {
      try {
        console.log('Démarrage de la récupération des dépêches...'); 
        
        const params = new URLSearchParams({
          'maxRecords': '100',
          'sort[0][field]': 'Date_de_Parution',
          'sort[0][direction]': 'desc',
          'view': 'Grid view'
        });

        const url = `${this.baseURL}?${params.toString()}`;
        console.log('URL de requête:', url);

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
        console.log('Nombre de dépêches reçues:', data.records?.length);
  
        if (!data.records || !Array.isArray(data.records)) {
          console.error('Format de données invalide:', data);
          return [];
        }
  
        const transformedDepeches = data.records.map(record => {
          const fields = record.fields;
          return {
            id: record.id,
            journal: fields.JOURNAL || '',
            status: fields.Status || STATUS.NON_LU,
            date_parution: fields.Date_de_Parution || '',
            heure_parution: fields.Date_de_Parution ? fields.Date_de_Parution.split(' ')[1] : '',
            journal_ai: fields.JOURNAL_AI || '',
            credit: fields.CREDIT || '',
            source: fields.Source || ''
          };
        });
  
        console.log(`Nombre de dépêches transformées: ${transformedDepeches.length}`);
        return transformedDepeches;
  
      } catch (error) {
        console.error('Erreur lors de la récupération des dépêches:', error);
        throw error;
      }
    }

    async createDepeche(fields) {
      try {
        this.validateFields(fields);

        const response = await fetch(this.baseURL, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            records: [{
              fields: {
                'JOURNAL': fields.journal,
                'Status': fields.status || STATUS.NON_LU,
                'Date_de_Parution': fields.date_parution,
                'JOURNAL_AI': fields.journal_ai,
                'CREDIT': fields.credit,
                'Source': fields.source
              }
            }]
          })
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        console.log('Dépêche créée avec succès:', result);
        return result;
      } catch (error) {
        console.error('Erreur lors de la création de la dépêche:', error);
        throw error;
      }
    }

    async updateDepeche(recordId, fields) {
      try {
        this.validateFields(fields);

        const response = await fetch(`${this.baseURL}/${recordId}`, {
          method: 'PATCH',
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            fields: {
              'JOURNAL': fields.journal,
              'Date_de_Parution': fields.date_parution,
              'JOURNAL_AI': fields.journal_ai,
              'CREDIT': fields.credit,
              'Source': fields.source
            }
          })
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        console.log('Dépêche mise à jour avec succès:', result);
        return result;
      } catch (error) {
        console.error('Erreur lors de la mise à jour de la dépêche:', error);
        throw error;
      }
    }

    async markAsRead(recordId) {
      try {
        const response = await fetch(`${this.baseURL}/${recordId}`, {
          method: 'PATCH',
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            fields: {
              'Status': STATUS.LU
            }
          })
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        console.log('Dépêche marquée comme lue:', result);
        return result;
      } catch (error) {
        console.error('Erreur lors du marquage de la dépêche:', error);
        throw error;
      }
    }

    async deleteDepeche(recordId) {
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
        console.log('Dépêche supprimée avec succès:', result);
        return result;
      } catch (error) {
        console.error('Erreur lors de la suppression de la dépêche:', error);
        throw error;
      }
    }

    validateFields(fields) {
      if (!fields.journal) throw new Error('Le journal est requis');
      if (!fields.date_parution) throw new Error('La date de parution est requise');
      
      // Validation du format de la date
      const dateRegex = /^\d{1,2}\/\d{1,2}\/\d{4}$/;
      if (!dateRegex.test(fields.date_parution)) {
        throw new Error('Format de date invalide. Utilisez le format DD/MM/YYYY');
      }
    }

    async getUnreadCount() {
      try {
        const params = new URLSearchParams({
          'filterByFormula': `{Status}='${STATUS.NON_LU}'`,
          'view': 'Grid view'
        });

        const response = await fetch(`${this.baseURL}?${params.toString()}`, {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return data.records.length;
      } catch (error) {
        console.error('Erreur lors du comptage des dépêches non lues:', error);
        throw error;
      }
    }
}

export const depechesService = new AirtableDepechesService(airtableConfig);