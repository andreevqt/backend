'use strict';

const pkg = require('../package.json');
const config = require('./config');

let host = config.get('app.url').replace(/(^\w+:|^)\/\//, '');
// Используем обратный прокси порт не важен
if (process.env.NODE_ENV !== 'production') {
  host += `:${config.get('app.port')}`;
}
host += `/${config.get('app.prefix')}`;

module.exports = {
  swagger: '2.0',

  host,

  info: {
    version: pkg.version,
    title: 'API backend\'а проекта Кинореакция'
  },

  license: {
    name: 'MIT',
    url: 'http://choosealicense.com/licenses/mit/'
  },

  tags: [{
    name: 'Фильмы',
    description: 'Информация о фильмах'
  }, {
    name: 'Люди',
    description: 'Информация об актерах, режиcсерах, людях связанных с кино'
  }, {
    name: 'Жанры',
    description: 'Приключения, комедия и т.д'
  }, {
    name: 'Пользователи',
    description: 'Авторизация, смена пароля, обновление токенов'
  }],

  paths: {
    '/movies/popular': {
      get: {
        tags: ['Фильмы'],
        parameters: [{
          in: 'query',
          name: 'page',
          description: 'Номер страницы',
          required: false
        }],
        summary: 'Популярные фильмы',
        description: 'Возвращает список популярных фильмов на <a href="https://developers.themoviedb.org/3/movies/get-popular-movies">TMDB</a>',
        responses: {
          200: {
            description: 'Успешно'
          },
        },
        produces: 'application/json'
      }
    },

    '/movies/top_rated': {
      get: {
        tags: ['Фильмы'],
        parameters: [{
          in: 'query',
          name: 'page',
          description: 'Номер страницы',
          required: false
        }],
        summary: 'Фильмы с самыми высокими оценками',
        description: 'Возвращает список самых популярных фильмов на <a href="https://developers.themoviedb.org/3/movies/get-top-rated-movies">TMDB</a>',
        responses: {
          200: {
            description: 'Успешно'
          },
        },
        produces: 'application/json'
      }
    },

    '/movies/upcoming': {
      get: {
        tags: ['Фильмы'],
        parameters: [{
          in: 'query',
          name: 'page',
          description: 'Номер страницы',
          required: false
        }],
        summary: 'Предстоящие фильмы',
        description: 'Возвращает список предстоящих фильмов на <a href="https://developers.themoviedb.org/3/movies/get-upcoming">TMDB</a>',
        responses: {
          200: {
            description: 'Успешно'
          },
        },
        produces: 'application/json'
      }
    },

    '/persons/{personId}': {
      get: {
        tags: ['Люди'],
        parameters: [{
          in: 'path',
          name: 'personId',
          description: 'id',
          required: true
        }],
        summary: 'Информация о человеке',
        description: 'Возвращает информацию о человеке на <a href="https://developers.themoviedb.org/3/people/get-person-details">TMDB</a>',
        responses: {
          200: {
            description: 'Успешно'
          },
          404: {
            description: 'Не найдено'
          }
        },
        produces: 'application/json'
      }
    },

    '/persons/{personId}/credits': {
      get: {
        tags: ['Люди'],
        parameters: [{
          in: 'path',
          name: 'personId',
          description: 'id',
          required: true
        }],
        summary: 'Фильмы в которых принял участие',
        description: 'Возвращает информация об участии в фильмах <a href="https://developers.themoviedb.org/3/people/get-person-movie-credits">TMDB</a>',
        responses: {
          200: {
            description: 'Успешно'
          },
          404: {
            description: 'Не найдено'
          }
        },
        produces: 'application/json'
      }
    },

    '/persons/popular': {
      get: {
        tags: ['Люди'],
        parameters: [{
          in: 'query',
          name: 'page',
          description: 'Номер страницы',
          required: false
        }],
        summary: 'Популярные люди',
        description: 'Возвращает список популярных людей на <a href="https://developers.themoviedb.org/3/people/get-popular-people">TMDB</a>',
        responses: {
          200: {
            description: 'Успешно'
          },
          404: {
            description: 'Не найдено'
          }
        },
        produces: 'application/json'
      }
    },

    '/genres': {
      get: {
        tags: ['Жанры'],
        summary: 'Жанры',
        description: 'Возвращает список жанров <a href="https://developers.themoviedb.org/3/genre/movie/list">TMDB</a>',
        responses: {
          200: {
            description: 'Успешно'
          },
          404: {
            description: 'Не найдено'
          }
        },
        produces: 'application/json'
      }
    },

    '/users': {
      get: {
        tags: ['Пользователи'],
        summary: 'Список',
        description: 'Создает нового пользователя',
        responses: {
          201: {
            schema: {
              type: 'object',
              properties: {
                results: {
                  type: 'array',
                  items: {
                    $ref: '#definitions/User'
                  }
                },
                page: {
                  type: 'integer',
                  example: 1
                },
                perPage: {
                  type: 'integer',
                  example: 15
                }
              }
            }
          }
        },
        produces: 'application/json'
      },

      post: {
        tags: ['Пользователи'],
        summary: 'Создать',
        description: 'Создает нового пользователя',
        parameters: [{
          in: 'body',
          type: 'object',
          name: 'body',
          required: false,
          schema: {
            $ref: '#definitions/CreateUserBody'
          }
        }],
        responses: {
          201: {
            schema: {
              $ref: '#definitions/CreateUserResponse'
            }
          },

          400: {
            schema: {
              type: 'object',
              properties: {
                success: {
                  type: 'boolean',
                  example: false
                },
                errors: {
                  type: 'array',
                  items: {
                    $ref: '#definitions/UserValidationError'
                  }
                }
              }
            }
          },

          409: {
            schema: {
              type: 'object',
              properties: {
                success: {
                  type: 'boolean',
                  example: false
                },
                message: {
                  type: 'string',
                  example: 'Email already exists'
                }
              }
            }
          }
        },
        produces: 'application/json'
      }
    },


    '/users/{userId}': {
      get: {
        tags: ['Пользователи'],
        summary: 'Инфо',
        description: 'Информация о пользователе',
        parameters: [{
          in: 'path',
          name: 'userId',
          required: true
        }],
        responses: {
          200: {
            schema: {
              type: 'object',
              properties: {
                success: {
                  type: 'boolean',
                  example: true
                },
                user: {
                  $ref: '#definitions/User'
                }
              }
            }
          },
          404: {
            schema: {
              type: 'object',
              properties: {
                success: {
                  type: 'boolean',
                  example: false
                },
                message: {
                  type: 'string',
                  example: 'User not found'
                }
              }
            }
          }
        },
        produces: 'application/json'
      }
    },

    '/users/token': {
      post: {
        tags: ['Пользователи'],
        summary: 'refreshToken/accessToken',
        description: 'Возвращает пару access/refresh токенов',
        parameters: [{
          in: 'body',
          name: 'body',
          schema: {
            type: 'object',
            properties: {
              token: {
                type: 'string',
                example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MywiaWF0IjoxNjQzNDk2MzAzLCJleHAiOjE2NDM0OTcyMDN9.Jqc3yPOtH4r3GKXKnYyw3BJxuN_Iq7awfdGHpwqsEs0'
              }
            }
          },
          required: true
        }],
        responses: {
          200: {
            schema: {
              type: 'object',
              properties: {
                success: {
                  type: 'boolean',
                  example: true
                },
                tokens: {
                  $ref: '#definitions/Tokens'
                }
              }
            }
          },
          401: {
            schema: {
              type: 'object',
              properties: {
                success: {
                  type: 'boolean',
                  example: false
                },
                message: {
                  type: 'string',
                  example: 'User not found'
                }
              }
            }
          },
          403: {
            schema: {
              type: 'object',
              properties: {
                success: {
                  type: 'boolean',
                  example: false
                },
                message: {
                  type: 'string',
                  example: 'Forbidden'
                }
              }
            }
          },
        },
        produces: 'application/json'
      }
    }
  },

  definitions: {
    User: {
      type: 'object',
      properties: {
        id: {
          type: 'integer',
          example: 1
        },
        name: {
          type: 'string',
          example: 'John Doe'
        },
        email: {
          type: 'string',
          example: 'example@yahoo.com'
        }
      }
    },

    Tokens: {
      type: 'object',
      properties: {
        access: {
          type: 'string',
          example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MywiaWF0IjoxNjQzNDk2MzAzLCJleHAiOjE2NDM0OTcyMDN9.Jqc3yPOtH4r3GKXKnYyw3BJxuN_Iq7awfdGHpwqsEs0'
        },
        refresh: {
          type: 'string',
          example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MywiaWF0IjoxNjQzNDk2MzAzfQ.LrYEG03CHLLIYz2o7tEJqxrGIvHSVf41Xvsza6FQ9uY'
        }
      }
    },

    CreateUserResponse: {
      type: 'object',
      properties: {
        success: {
          type: 'boolean',
          example: true
        },
        user: {
          type: 'object',
          properties: {
            name: {
              type: 'string',
              example: 'John Doe'
            },
            email: {
              type: 'string',
              example: 'example@mail.com'
            },
            password: {
              type: 'string',
              example: 'example@mail.com'
            },
            tokens: {
              $ref: '#definitions/Tokens'
            }
          }
        }
      }
    },

    CreateUserBody: {
      type: 'object',
      properties: {
        name: {
          required: true,
          type: 'string',
          example: 'John Doe'
        },
        email: {
          required: true,
          type: 'string',
          example: 'example@mail.com'
        },
        password: {
          required: true,
          type: 'string',
          example: '12354'
        }
      }
    },

    UserValidationError: {
      type: 'object',
      properties: {
        email: {
          type: 'string',
          example: 'Email is invalid'
        }
      }
    },

  }
};