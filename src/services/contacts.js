import { ContactModel } from '../bd/models/contact.js';

export const getAllContacts = async ({
  page,
  perPage,
  sortBy,
  sortOrder,
  filter,
}) => {
  const skip = page > 0 ? (page - 1) * perPage : 0;

  const contactQuery = ContactModel.find();

  if (typeof filter.type !== 'undefined') {
    contactQuery.where('contactType').equals(filter.type);
  }

  if (typeof filter.isFavourite !== 'undefined') {
    contactQuery.where('isFavourite').equals(filter.isFavourite);
  }

  const [totalItems, data] = await Promise.all([
    ContactModel.countDocuments(contactQuery),
    contactQuery
      .sort({ [sortBy]: sortOrder })
      .skip(skip)
      .limit(perPage),
  ]);

  const totalPages = Math.ceil(totalItems / perPage);

  return {
    data,
    page,
    perPage,
    totalItems,
    totalPages,
    hasNextPage: totalPages > page,
    hasPreviousPage: page > 1,
  };
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
  const contact = await ContactModel.findByIdAndUpdate(contactId, payload, {
    new: true,
  });
  return contact;
};
