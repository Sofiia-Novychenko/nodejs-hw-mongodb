import { ContactModel } from '../bd/models/contact.js';

export const getAllContacts = async () => {
  const contacts = await ContactModel.find();

  return contacts;
};

export const getOneContact = async (contactId) => {
  const contact = await ContactModel.findById(contactId);

  return contact;
};
