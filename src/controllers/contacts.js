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
    userId: req.user._id,
  });

  resp.json({
    status: 200,
    message: 'Successfully found contacts!',
    data: contacts,
  });
};

export const getOneContactController = async (req, resp) => {
  const { contactId } = req.params;
  const contact = await getOneContact({ contactId, userId: req.user._id });

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

  //! треба передати два ОКРЕМІ аргументи, а не ОбʼЄКТ
  const deletedContact = await deleteOneContact(contactId, req.user._id);

  if (deletedContact === null) {
    throw createHttpError(404, 'Contact not found');
  }

  //* .end() бо нема що повернути окрім як статус
  resp.status(204).end();
};

export const createOneContactController = async (req, resp) => {
  //* пейлоадом є тіло запиту, в нього ж записуємо userId
  const createdContact = await createOneContact({
    ...req.body,
    userId: req.user._id,
  });

  resp.status(201).json({
    status: 201,
    message: 'Successfully created a contact!',
    data: createdContact,
  });
};

export const patchOneContactController = async (req, resp) => {
  const { contactId } = req.params;

  //! треба передати три ОКРЕМІ аргументи, а не ОбʼЄКТ
  const patchedContact = await patchOneContact(
    contactId,
    req.body,
    req.user._id,
  );

  if (patchedContact === null) {
    throw createHttpError(404, 'Contact not found');
  }

  resp.json({
    status: 200,
    message: 'Successfully patched a contact!',
    data: patchedContact,
  });
};
