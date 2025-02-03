import {defineField, defineType} from 'sanity'

export const venueType = defineType({
  name: 'venue',
  title: 'Venue',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      type: 'string',
      title: 'Name of the Venue',
      // description: 'The name of the venue where the event is taking place',
      description: (
        <details>
    <summary>Why is this important?</summary>
    The Googlebot is an indexer of...
  </details>
      ),
      validation: (Rule) => Rule.min(10).required().info('this is required for user to see where the event is').max(50).warning('name should be in 10 to 50 characters'),
    }),
    defineField({
      name: 'city',
      type: 'string',
    }),
    defineField({
      name: 'country',
      type: 'string',
    }),
  ],
})