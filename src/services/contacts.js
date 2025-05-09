import { contactsCollection } from '../bd/models/contact.js';

export const getAllContacts = async () => {
  const contacts = await contactsCollection.find();

  return contacts;
};

export const getOneContact = async (contactId) => {
  const contact = await contactsCollection.findById(contactId);

  return contact;
};
