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
          published: 1475574906524,
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

        // hasMany with inverse belongsTo
        node_5: {
          created: 1395162147646,
          user: 'tstirrat',
          label: 'Node 5 (hasMany with inverse belongsTo)',
          children: {
            node_5_1: {
              created: 1395162147646,
              label: 'Node 5.1',
              parent: 'node_5'
            }
          }
        }

      },
    }
  }
};
