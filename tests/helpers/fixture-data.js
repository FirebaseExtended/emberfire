export default {
  blogs: {
    normalized: {
      users: {
        aputinski: {
          firstName: 'Adam',
          created: 1395162147634,
          posts: {
            post_1: true,
            post_2: true
          }
        },
        esnowden: {
          firstName: 'Edward',
          created: 1395162147634,
          posts: {
            post_3: true
          }
        }
      },
      posts: {
        post_1: {
          published: 1395162147646,
          user: 'aputinski',
          body: 'This is the first FireBlog post!',
          comments: {
            comment_1: true,
            comment_2: true
          },
          title: 'Post 1'
        },
        post_2: {
          published: 1395162147646,
          user: 'aputinski',
          body: 'This is the second FireBlog post!',
          comments: {
            comment_3: true,
            comment_4: true
          },
          title: 'Post 2'
        },
        post_3: {
          published: 1395162147646,
          user: 'esnowden',
          body: 'This is the third FireBlog post!',
          comments: {
            comment_5: true,
            comment_6: true
          },
          title: 'Post 3'
        }
      },
      comments: {
        comment_1: {
          published: 1395176007623,
          user: 'aputinski',
          body: 'This is a comment'
        },
        comment_2: {
          published: 1395176007624,
          user: 'aputinski',
          body: 'This is a second comment'
        },
        comment_3: {
          published: 1395176007625,
          user: 'aputinski',
          body: 'This is a third comment'
        },
        comment_4: {
          published: 1395176007626,
          user: 'aputinski',
          body: 'This is a fourth comment'
        },
        comment_5: {
          published: 1395176007627,
          user: 'esnowden',
          body: 'This is a fifth comment'
        },
        comment_6: {
          published: 1395176007628,
          user: 'esnowden',
          body: 'This is a sixth comment'
        }
      }
    },
    queries: {
      users: {
        tstirrat: {
          firstName: 'Tim',
          created: 1395162147634,
          posts: {
            post_1: true,
            post_2: true,
            post_3: true
          }
        }
      },
      posts: {
        post_1: {
          published: 1395162147646,
          user: 'tstirrat',
          body: 'This is the first FireBlog post!',
          comments: {
            comment_1: true,
            comment_2: true
          },
          title: 'Post 1'
        },
        post_2: {
          published: 1395162147646,
          user: 'tstirrat',
          body: 'This is the second FireBlog post!',
          comments: {
            comment_3: true,
            comment_4: true
          },
          title: 'Post 2'
        },
        post_3: {
          published: 1395162147646,
          user: 'tstirrat',
          body: 'This is the third FireBlog post!',
          comments: {
            comment_3: true,
            comment_4: true
          },
          title: 'Post 3'
        }
      },
    },


    embedded: {
      treeNodes: {

        // hasMany single level
        node_1: {
          created: 1395162147646,
          user: 'tstirrat',
          label: 'Node 1 (hasMany single level)',
          children: {
            node_1_1: {
              created: '1395162147646', // to test transforms
              user: 'tstirrat',
              label: 'Node 1.1'
            },
            node_1_2: {
              created: 1395162147646,
              user: 'tstirrat',
              label: 'Node 1.2'
            },
          }
        },

        // hasMany multi-level
        node_2: {
          created: 1395162147646,
          user: 'tstirrat',
          label: 'Node 2 (hasMany multi-level)',
          children: {
            node_2_1: {
              created: 1395162147646,
              label: 'Node 2.1',
              children: {
                node_2_1_1: {
                  created: 1395162147646,
                  label: 'Node 2.1.1',
                }
              }
            },
            node_2_2: {
              created: 1395162147646,
              user: 'tstirrat',
              label: 'Node 2.2',
              children: {
                node_2_2_1: {
                  created: 1395162147646,
                  label: 'Node 2.2.1',
                }
              }
            },
          }
        },

        // belongsTo
        node_3: {
          created: 1395162147646,
          user: 'tstirrat',
          label: 'Node 3 (belongsTo)',
          config: {
            id: 'node_3_config',
            sync: true,
            updated: '1395162147646' // to test transforms
          }
        },

        // hasMany with belongsTo
        node_4: {
          created: 1395162147646,
          user: 'tstirrat',
          label: 'Node 4 (hasMany with belongsTo)',
          children: {
            node_4_1: {
              created: 1395162147646,
              label: 'Node 4.1',
              config: {
                id: 'node_4_1_config',
                sync: true
              }
            }
          }
        },

      },
    }
  },

  "acceptance": {

    "comments": {
      "post_1_comment_1": {
        "body": "This is a comment",
        "published": 1395176007623,
        "user": "sara"
      },
      "post_1_comment_2": {
        "body": "This is another comment",
        "published": 1395176007625,
        "user": "tstirrat"
      }
    }, // comments

    "posts": {
      "post_1": {
        "title": "Post 1",
        "body": "Post 1 body",
        "published": 1395398324134,
        "user": "tstirrat",
        "comments": {
          "post_1_comment_1": true,
          "post_1_comment_2": true,
        }
      },
      "post_2": {
        "title": "Post 2",
        "body": "Post 2 body",
        "published": 1395398324134,
        "user": "tstirrat"
      },
      "post_3": {
        "title": "Post 3",
        "body": "Post 3 body",
        "published": 1395398324135,
        "user": "tstirrat"
      },
      "post_4": {
        "title": "Post 4",
        "body": "Post 4 body",
        "published": 1395398324136,
        "user": "tstirrat"
      },
      "post_5": {
        "title": "Post 5",
        "body": "Post 5 body",
        "published": 1395398324137,
        "user": "tstirrat"
      },
      "post_6": {
        "title": "Post 6",
        "body": "Post 6 body",
        "published": 1395398324138,
        "user": "tstirrat"
      },
      "post_7": {
        "title": "Post 7",
        "body": "Post 7 body",
        "published": 1395398324139,
        "user": "tstirrat"
      },
      "post_8": {
        "title": "Post 8",
        "body": "Post 8 body",
        "published": 1395398324140,
        "user": "tstirrat"
      },
      "post_9": {
        "title": "Post 9",
        "body": "Post 9 body",
        "published": 1395398324141,
        "user": "tstirrat"
      },
      "post_10": {
        "title": "Post 10",
        "body": "Post 10 body",
        "published": 1395398324142,
        "user": "tstirrat"
      },
      "post_11": {
        "title": "Post 11",
        "body": "Post 11 body",
        "published": 1395398324143,
        "user": "tstirrat"
      },
      "post_12": {
        "title": "Post 12",
        "body": "Post 12 body",
        "published": 1395398324144,
        "user": "tstirrat"
      },
      "post_13": {
        "title": "Post 13",
        "body": "Post 13 body",
        "published": 1395398324145,
        "user": "tstirrat"
      },
      "post_14": {
        "title": "Post 14",
        "body": "Post 14 body",
        "published": 1395398324146,
        "user": "tstirrat"
      },
      "post_15": {
        "title": "Post 15",
        "body": "Post 15 body",
        "published": 1395398324147,
        "user": "tstirrat"
      },
      "post_16": {
        "title": "Post 16",
        "body": "Post 16 body",
        "published": 1395398324148,
        "user": "tstirrat"
      },
      "post_17": {
        "title": "Post 17",
        "body": "Post 17 body",
        "published": 1395398324149,
        "user": "tstirrat"
      },
      "post_18": {
        "title": "Post 18",
        "body": "Post 18 body",
        "published": 1395398324150,
        "user": "tstirrat"
      },
      "post_19": {
        "title": "Post 19",
        "body": "Post 19 body",
        "published": 1395398324151,
        "user": "tstirrat"
      },
      "post_20": {
        "title": "Post 20",
        "body": "Post 20 body",
        "published": 1395398324152,
        "user": "tstirrat"
      },
      "post_21": {
        "title": "Post 21",
        "body": "Post 21 body",
        "published": 1395398324153,
        "user": "tstirrat"
      },
    }, // posts

    "users": {
      "tstirrat": {
        "created": 1429978864377,
        "firstName": "Tim"
      },
      "sara": {
        "created": 1429978864379,
        "firstName": "Sara"
      }
    }
  }
};
