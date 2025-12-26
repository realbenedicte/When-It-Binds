# Shows Management System

This system allows you to easily update your live shows without touching any code. There are two files you can work with:

## Option 1: JSON File (Recommended)
**File:** `data/shows.json`

This is a structured format that's easy to edit. Here's how to add or modify shows:

### Adding a New Show
```json
{
  "date": "July 15",
  "venue": "Venue Name", 
  "location": "City, Country",
  "isDJ": false,
  "link": "https://example.com" 
}
```

### Fields Explained:
- **date**: Date of the show (e.g., "May 16", "December 3")
- **venue**: Name of the venue or event
- **location**: Full location (City, Country) 
- **isDJ**: Set to `true` if it's a DJ set, `false` if it's a live performance
- **link**: Website URL (use `null` if no link)

### Adding a New Year:
```json
{
  "year": "2026",
  "events": [
    {
      "date": "January 1",
      "venue": "New Year Event",
      "location": "Montreal, Canada", 
      "isDJ": false,
      "link": null
    }
  ]
}
```

## Quick Edit Instructions:

1. **To add a new show:** Copy an existing event object and modify the details
2. **To remove a show:** Delete the entire event object (including the comma)
3. **To add a new year:** Copy an existing year object and modify
4. **To change the footer message:** Edit the "footerMessage" field at the bottom

## Notes:
- Always save the file after making changes
- Refresh your browser to see updates
- Keep the JSON format structure intact
- Use `null` (without quotes) for empty fields
- Use `true`/`false` (without quotes) for the isDJ field

## Troubleshooting:
- If shows don't load, check the browser console for errors
- Make sure all brackets { } and commas are in the right places
- Test your JSON at jsonlint.com if needed
- Contact your developer if you need help

## File Location:
The shows data file is located at: `data/shows.json`

Simply edit this file and save it - the website will automatically load the new information!