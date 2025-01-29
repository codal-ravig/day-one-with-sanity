import {defineField, defineType} from 'sanity'
import {CalendarIcon} from '@sanity/icons'
import { DoorsOpenInput } from './components/DoorsOpenInput'
export const eventType = defineType({
  name: 'event',
  title: 'Event',
  type: 'document',
  icon: CalendarIcon,
  groups: [
    {name: 'details', title: 'Details'},
    {name: 'editorial', title: 'Editorial'},
  ],
  fields: [
    defineField({
      name: 'name',
      type: 'string',
      group: 'details',
    }),
    defineField({
      name: 'slug',
      type: 'slug',
      options: {
        source: 'name',
      },
      group: 'details',
      validation: Rule => Rule.required().error('Slug is required'),
      hidden: ({document}) => !document?.name,
    }),
    defineField({
      name: 'eventType',
      type: 'string',
      group: 'details',
      options: {
        list: ['concert', 'festival', 'conference', 'other'],
        layout: 'dropdown',
        }
    }),    
    defineField({
      name: 'date',
      type: 'date',
      group: 'details',
    }),
    defineField({
      name: 'doorsOpen',
      group: 'details',
      type: 'number',
      initialValue: 0,
      description: 'Time in minutes before the event starts',
      components:{
        input: DoorsOpenInput,
      }
    }),
    defineField({
      name: 'venue',
      type: 'reference',
      group: 'details',
      to: [{type: 'venue'}],
      readOnly: ({document}) => document?.eventType === 'festival',
      validation: (rule) =>
        rule.custom((value, context) => {
          if (value && context?.document?.eventType === 'festival') {
            return 'no festival events can have a venue'
          }
    
          return true
        }),
    }),
    defineField({
      name: 'headline',
      type: 'reference',
      group: 'details',
      to: [{type: 'artist'}],
    }),
    defineField({
      name: 'image',
      group: 'editorial',
      type: 'image',
    }),
    defineField({
      name: 'details',
      type: 'array',
      group: 'editorial',
      of: [{type: 'block'}],
    }),
    defineField({
      name: 'tickets',
      group: 'details',
      type: 'url',
    }),
  ],
  preview: {
    select: {
      name: 'name',
      venue: 'venue.name',
      artist: 'headline.name',
      date: 'date',
      image: 'image',
    },
    prepare({name, venue, artist, date, image}) {
      const nameFormatted = name || 'Untitled event'
      const dateFormatted = date
        ? new Date(date).toLocaleDateString(undefined, {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
          })
        : 'No date'
  
      return {
        title: artist ? `${nameFormatted} (${artist})` : nameFormatted,
        subtitle: venue ? `${dateFormatted} at ${venue}` : dateFormatted,
        media: image || CalendarIcon,
      }
    },
  },
})