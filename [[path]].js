<script>
// Create a JSON array
const jsonArray = [
    { "id": 1, "name": "Alice", "age": 25 },
    { "id": 2, "name": "Bob", "age": 30 },
    { "id": 3, "name": "Charlie", "age": 35 }
];

// Set the content type to JSON
document.contentType = 'application/json';

// Output the JSON array as a response
document.write(JSON.stringify(jsonArray));

</script>