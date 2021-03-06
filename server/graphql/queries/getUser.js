import {GraphQLNonNull, GraphQLString} from 'graphql'

import {resolveUser} from 'src/server/graphql/resolvers'
import {UserProfile} from 'src/server/graphql/schemas'

export default {
  type: UserProfile,
  args: {
    identifier: {type: new GraphQLNonNull(GraphQLString), description: 'The user ID or handle'},
  },
  resolve: resolveUser,
}
