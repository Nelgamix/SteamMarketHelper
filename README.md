## Run
```shell script
deno run --allow-net --allow-read --allow-write main.ts
```

## Add item
Add item in file `items.json`:
```json
{
  "name": "Exact name of the item"
}
```
Optional: specify quantity, threshold (in cents) and tags

```json
{
  "name": "Exact name of the item",
  "threshold": 125,
  "quantity": 2,
  "tags": ["Sticker", "Cologne 2015"]
}
```

## Configure
Configuration is in file `config.json` (run the program first if file does not exist).
