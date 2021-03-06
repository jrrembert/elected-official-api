A JSON API for finding information on each state's governors and Congressional members.

## Requirements

None!

The Elected Officials API is currently completely free to use - no API keys or registration are required.

The API is completely language agnostic; API call can be made by any library capable of sending and receiving HTTP requests/responses.

## Usage

The API features two main endpoints: `/governors` and `/congress`.

1. Both endpoints accept optional query parameters and return results as JSON.
2. Any field present in a document can be queried on.
3. All query parameters are case-sensitive with one notable exception:
  * The `state` parameter for both endpoints accepts a case-insensitive string. The string can be either the full state name or the state abbreviation.
  * The `party` parameter for `/congress` accepts a case-insensitive string and can either be the full party name or the first letter.

Note: there are some inconsistencies with how query fields are validated across endpoints. The differences are minor and will be addressed once a common schema for both datasets has been settled on.

**Additional endpoints:**

There are two additional endpoints: `/governors/:id` and `/congress/:id`. `:id` corresponds to the `_id` field that is autoassigned to each Mongo document.

These endpoints are made available to provide a REST-ish resource interface for exact document matches, but aren't necessary for normal API usage.


#### Examples

Get governors for all states.

```
GET https://localhost:3000/v1/governors

Response Body:

[
  {
    party: "Republican",
    last_updated: "2016-02-17T13:32:10.325Z",
    name: "Robert J. Bentley",
    state: "Alabama",
    state_abbreviation: "AL",
    term_end: "2019 (term limits)",
    position: "governor",
    took_office: "January 17, 2011"
  },
  {
    party: "Independent",
    last_updated: "2016-02-17T13:32:10.654Z",
    name: "Bill Walker",
    state: "Alaska",
    state_abbreviation: "AK",
    term_end: "2018",
    position: "governor",
    took_office: "December 1, 2014"
  },
...
}
```

Get elected officials for South Carolina (using full state name).

```
GET https://localhost:3000/v1/governors?state=South Carolina

Response Body:

{
  party: "Republican",
  last_updated: "2016-02-17T13:32:10.687Z",
  name: "Nikki Haley",
  state: "South Carolina",
  state_abbreviation: "SC",
  term_end: "2019 (term limits)",
  position: "governor",
  took_office: "January 12, 2011"
}
```

Get all Democratic members of Congress for South Carolina (using state abbreviation).

```
GET https://localhost:3000/v1/congress?state=sc&party=democrat

Response Body:
{
  last_name: "Clyburn",
  state_name: "South Carolina",
  office: "242 Cannon House Office Building",
  icpsr_id: 39301,
  thomas_id: "00208",
  first_name: "James",
  middle_name: "E.",
  district: 6,
  title: "Rep",
  in_office: true,
  state: "SC",
  term_end: "2017-01-03",
  crp_id: "N00002408",
  oc_email: "Rep.Clyburn@opencongress.org",
  party: "D",
  fec_ids: [
  "H2SC02042"
  ],
  votesmart_id: 27066,
  website: "http://clyburn.house.gov",
  fax: "202-225-2313",
  govtrack_id: "400075",
  facebook_id: "127744320598870",
  bioguide_id: "C000537",
  birthday: "1940-07-21",
  term_start: "2015-01-06",
  nickname: "Jim",
  contact_form: "https://clyburn.house.gov/contact-me/email-me",
  ocd_id: "ocd-division/country:us/state:sc/cd:6",
  phone: "202-225-3315",
  gender: "M",
  name_suffix: null,
  twitter_id: "Clyburn",
  chamber: "house",
  youtube_id: "repjamesclyburn"
}
```

## Contributions

This is currently a pretty barebones API and there is plenty that can be done to improve it.

Instructions to set up a dev environment can be found in the [wiki](https://github.com/jrrembert/elected-official-api/wiki/Project-setup).

Changes should be submitted as pull requests and will be reviewed as soon as I can. To expedite the process, please include tests as appropriate. Actually, there is a better than average chance PRs will be rejected outright if lacking tests. Moral of the story: make tests, you'll be glad you did.
