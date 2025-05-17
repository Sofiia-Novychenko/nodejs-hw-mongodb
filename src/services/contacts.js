import { ContactModel } from '../bd/models/contact.js';

export const getAllContacts = async () => {
  const contact = await ContactModel.find();
  return contact;
};

export const getOneContact = async (contactId) => {
  const contact = await ContactModel.findById(contactId);
  return contact;
};

export const deleteOneContact = async (contactId) => {
  const contact = await ContactModel.findByIdAndDelete(contactId);
  return contact;
};

export const createOneContact = async (payload) => {
  const contact = await ContactModel.create(payload);
  return contact;
};

export const patchOneContact = async (contactId, payload) => {
  const contact = await ContactModel.findByIdAndUpdate(
    { _id: contactId },
    payload,
    {
      new: true,
    },
  );
  return contact;
};
