import {GraphQLNonNull, GraphQLID, GraphQLString} from 'graphql'
import {GraphQLURL, GraphQLDateTime} from 'graphql-custom-types'
import {GraphQLObjectType} from 'graphql/type'

export const ThinProject = new GraphQLObjectType({
  name: 'ThinProject',
  description: 'A "thin" project object with just the id',
  fields: () => ({
    id: {type: new GraphQLNonNull(GraphQLID), description: "The project's UUID"},
  })
})

export const Project = new GraphQLObjectType({
  name: 'Project',
  description: 'A project engaged in by learners to complete some goal',
  fields: () => ({
    id: {type: new GraphQLNonNull(GraphQLID), description: "The project's UUID"},
    name: {type: new GraphQLNonNull(GraphQLString), description: 'The project name'},
    chapterId: {type: new GraphQLNonNull(GraphQLID), description: "The project chapter's UUID"},
    artifactURL: {type: GraphQLURL, description: 'The URL pointing to the output of this project'},
    // Punting on cycleHistory for now
    createdAt: {type: new GraphQLNonNull(GraphQLDateTime), description: 'When this record was created'},
    updatedAt: {type: new GraphQLNonNull(GraphQLDateTime), description: 'When this record was last updated'},
  })
})