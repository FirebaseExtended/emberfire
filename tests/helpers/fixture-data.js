export default {
  "blogs": {
    "normalized": {
      "users": {
        "aputinski": {
          "firstName": "Adam",
          "created": 1395162147634,
          "posts": {
            "post_1": true,
            "post_2": true
          }
        },
        "esnowden": {
          "firstName": "Edward",
          "created": 1395162147634,
          "posts": {
            "post_3": true
          }
        }
      },
      "posts": {
        "post_1": {
          "published": 1395162147646,
          "user": "aputinski",
          "body": "This is the first FireBlog post!",
          "comments": {
            "comment_1": true,
            "comment_2": true
          },
          "title": "Post 1"
        },
        "post_2": {
          "published": 1395162147646,
          "user": "aputinski",
          "body": "This is the second FireBlog post!",
          "comments": {
            "comment_3": true,
            "comment_4": true
          },
          "title": "Post 2"
        },
        "post_3": {
          "published": 1395162147646,
          "user": "esnowden",
          "body": "This is the third FireBlog post!",
          "comments": {
            "comment_5": true,
            "comment_6": true
          },
          "title": "Post 3"
        }
      },
      "comments": {
        "comment_1": {
          "published": 1395176007623,
          "user": "aputinski",
          "body": "This is a comment"
        },
        "comment_2": {
          "published": 1395176007624,
          "user": "aputinski",
          "body": "This is a second comment"
        },
        "comment_3": {
          "published": 1395176007625,
          "user": "aputinski",
          "body": "This is a third comment"
        },
        "comment_4": {
          "published": 1395176007626,
          "user": "aputinski",
          "body": "This is a fourth comment"
        },
        "comment_5": {
          "published": 1395176007627,
          "user": "esnowden",
          "body": "This is a fifth comment"
        },
        "comment_6": {
          "published": 1395176007628,
          "user": "esnowden",
          "body": "This is a sixth comment"
        }
      }
    },
    "queries": {
      "users": {
        "tstirrat": {
          "firstName": "Tim",
          "created": 1395162147634,
          "posts": {
            "post_1": true,
            "post_2": true,
            "post_3": true
          }
        }
      },
      "posts": {
        "post_1": {
          "published": 1395162147646,
          "user": "tstirrat",
          "body": "This is the first FireBlog post!",
          "comments": {
            "comment_1": true,
            "comment_2": true
          },
          "title": "Post 1"
        },
        "post_2": {
          "published": 1395162147646,
          "user": "tstirrat",
          "body": "This is the second FireBlog post!",
          "comments": {
            "comment_3": true,
            "comment_4": true
          },
          "title": "Post 2"
        },
        "post_3": {
          "published": 1395162147646,
          "user": "tstirrat",
          "body": "This is the third FireBlog post!",
          "comments": {
            "comment_3": true,
            "comment_4": true
          },
          "title": "Post 3"
        }
      },
    },
    "denormalized": {
      "posts": {
        "post_1": {
          "published": 1395162147646,
          "user": "aputinski",
          "body": "This is the first FireBlog post!",
          "comments": {
            "comment_1": {
              "published": 1395176007623,
              "user": "aputinski",
              "body": "This is a comment"
            },
            "comment_2": {
              "published": 1395176007624,
              "user": "aputinski",
              "body": "This is a second comment"
            }
          },
          "title": "Post 1"
        },
        "post_2": {
          "published": 1395162147646,
          "user": "aputinski",
          "body": "This is the second FireBlog post!",
          "comments": {
            "comment_3": {
              "published": 1395176007625,
              "user": "aputinski",
              "body": "This is a third comment"
            },
            "comment_4": {
              "published": 1395176007626,
              "user": "aputinski",
              "body": "This is a fourth comment"
            }
          },
          "title": "Post 2"
        }
      }
    },
    "double_denormalized": {
      "posts": {
        "post_1": {
          "published": 1395162147646,
          "user": "aputinski",
          "body": "This is the first FireBlog post!",
          "embeddedComments": {
            "comment_1": {
              "published": "32",
              "embeddedUser": {
                "id": "aputinski",
                "firstName": "Adam"
              },
              "body": "This is a comment"
            },
          },
          "title": "Post 1"
        },
      },
    },
    "invalid": {
      "posts": {
        "post_1": {
          "published": 1395162147646,
          "user": "aputinski",
          "body": "This is the first FireBlog post!",
          "comments": ["comment_1", "comment_2"],
          "title": "Post 1"
        },
        "post_2": {
          "published": 1395162147646,
          "user": "aputinski",
          "body": "This is the second FireBlog post!",
          "comments": ["comment_3", "comment_4"],
          "title": "Post 2"
        }
      }
    }
  }
};
