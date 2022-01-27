'use strict';

// https://vincit.github.io/objection.js/recipes/error-handling.html#examples

const {
  ValidationError,
  NotFoundError,
  DBError,
  ConstraintViolationError,
  UniqueViolationError,
  NotNullViolationError,
  ForeignKeyViolationError,
  CheckViolationError,
  DataError
} = require('objection');

const { Http } = require('../../constants');

module.exports = (err, req, res, next) => {
  if (err instanceof ValidationError) {
    switch (err.type) {
      case 'ModelValidation':
        res.status(Http.BAD_REQUEST).send({
          message: err.message,
          type: err.type,
          data: err.data
        });
        break;
      case 'RelationExpression':
        res.status(Http.BAD_REQUEST).send({
          message: err.message,
          type: 'RelationExpression',
          data: {}
        });
        break;
      case 'UnallowedRelation':
        res.status(Http.BAD_REQUEST).send({
          message: err.message,
          type: err.type,
          data: {}
        });
        break;
      case 'InvalidGraph':
        res.status(Http.BAD_REQUEST).send({
          message: err.message,
          type: err.type,
          data: {}
        });
        break;
      default:
        res.status(Http.BAD_REQUEST).send({
          message: err.message,
          type: 'UnknownValidationError',
          data: {}
        });
        break;
    }
  } else if (err instanceof NotFoundError) {
    res.status(Http.NOT_FOUND).send({
      message: err.message,
      type: 'NotFound',
      data: {}
    });
  } else if (err instanceof UniqueViolationError) {
    res.status(Http.CONFLICT).send({
      message: err.message,
      type: 'UniqueViolation',
      data: {
        columns: err.columns,
        table: err.table,
        constraint: err.constraint
      }
    });
  } else if (err instanceof NotNullViolationError) {
    res.status(Http.BAD_REQUEST).send({
      message: err.message,
      type: 'NotNullViolation',
      data: {
        column: err.column,
        table: err.table
      }
    });
  } else if (err instanceof ForeignKeyViolationError) {
    res.status(Http.CONFLICT).send({
      message: err.message,
      type: 'ForeignKeyViolation',
      data: {
        table: err.table,
        constraint: err.constraint
      }
    });
  } else if (err instanceof CheckViolationError) {
    res.status(Http.BAD_REQUEST).send({
      message: err.message,
      type: 'CheckViolation',
      data: {
        table: err.table,
        constraint: err.constraint
      }
    });
  } else if (err instanceof DataError) {
    res.status(Http.BAD_REQUEST).send({
      message: err.message,
      type: 'InvalidData',
      data: {}
    });
  } else if (err instanceof DBError) {
    res.status(Http.INTERNAL_SERVER_ERROR).send({
      message: err.message,
      type: 'UnknownDatabaseError',
      data: {}
    });
  } else {
    res.status(Http.INTERNAL_SERVER_ERROR).send({
      message: err.message,
      type: 'InternalServerError',
      data: {}
    });
  }
  next();
};
