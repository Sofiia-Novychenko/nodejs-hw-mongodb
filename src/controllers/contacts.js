import {
  getAllContacts,
  getOneContact,
  deleteOneContact,
  createOneContact,
  patchOneContact,
} from '../services/contacts.js';
import createHttpError from 'http-errors';
import { parsPaginationParams } from '../utils/parsPaginationParams.js';
import { parsSortParams } from '../utils/parsSortParams.js';
import { parsFiltersParams } from '../utils/parsFiltersParams.js';

export const getAllContactsController = async (req, resp) => {
  const { page, perPage } = parsPaginationParams(req.query);
  const { sortBy, sortOrder } = parsSortParams(req.query);
  const filter = parsFiltersParams(req.query);

  const contacts = await getAllContacts({
    page,
    perPage,
    sortBy,
    sortOrder,
    filter,
  });

  resp.json({
    status: 200,
    message: 'Successfully found contacts!',
    data: contacts,
  });
};

export const getOneContactController = async (req, resp) => {
  const { contactId } = req.params;
  const contact = await getOneContact(contactId.trim());

  if (contact === null) {
    throw createHttpError(404, 'Contact not found');
  }
  resp.json({
    status: 200,
    message: `Successfully found contact with id ${contactId}!`,
    data: contact,
  });
};

export const deleteOneContactController = async (req, resp) => {
  const { contactId } = req.params;
  const deletedContact = await deleteOneContact(contactId.trim());

  if (deletedContact === null) {
    throw createHttpError(404, 'Contact not found');
  }

  //* .end() бо нема що повернути окрім як статус
  resp.status(204).end();
};

export const createOneContactController = async (req, resp) => {
  //* пейлоадом є тіло запиту
  const createdContact = await createOneContact(req.body);

  resp.status(201).json({
    status: 201,
    message: 'Successfully created a contact!',
    data: createdContact,
  });
};

export const patchOneContactController = async (req, resp) => {
  const { contactId } = req.params;
  const patchedContact = await patchOneContact(contactId, req.body);

  if (patchedContact === null) {
    throw createHttpError(404, 'Contact not found');
  }

  resp.json({
    status: 200,
    message: 'Successfully patched a contact!',
    data: patchedContact,
  });
};
