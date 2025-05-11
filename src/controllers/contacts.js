import { getAllContacts, getOneContact } from './services/contacts.js';
import createHttpError from 'http-errors';

export const getAllContactsController = async (req, resp) => {
  const contacts = await getAllContacts();

  resp.json({
    status: 200,
    message: 'Successfully found contacts!',
    data: contacts,
  });
};

export const getOneContactController = async (req, resp, next) => {
  const { contactId } = req.params;

  const contact = await getOneContact(contactId.trim());

  if (!contact) {
    throw createHttpError(404, 'Contact not found');
  }
  resp.json({
    status: 200,
    message: `Successfully found contact with id ${contactId}!`,
    data: contact,
  });
};
