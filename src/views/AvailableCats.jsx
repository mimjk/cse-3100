import { useEffect, useState } from 'react';

const availableCats = [
  { name: 'Whiskers', age: '', breed: 'Bengal' },
  { name: 'Mittens', age: '2', breed: 'Persian' },
  { name: 'Shadow', age: '3', breed: 'Siamese' },
  { name: 'Pumpkin', age: '2', breed: 'Sphynx' },
  { name: 'Luna', age: '4', breed: 'Peterbald' },
  { name: 'Simba', age: '5', breed: 'Abyssinian' },
];

export default function AvailableCats() {
  const [cats, setCats] = useState([]);
  const [filteredCats, setFilteredCats] = useState([]);
  const [search, setSearch] = useState('');
  const [selectedBreed, setSelectedBreed] = useState('');

  useEffect(() => {
    const fetchCatImages = async () => {
      try {
        const responses = await Promise.all(availableCats.map(() => fetch('https://api.thecatapi.com/v1/images/search').then((res) => res.json())));
        const catsWithImages = availableCats.map((cat, index) => ({
          ...cat,
          image: responses[index][0].url,
        }));
        setCats(catsWithImages);
        setFilteredCats(catsWithImages);
      } catch (error) {
        console.error('Error fetching cat images:', error);
      }
    };

    fetchCatImages();
  }, []);

  const handleSearch = () => {
    const result = cats.filter((cat) => cat.name.toLowerCase().includes(search.toLowerCase()));
    setFilteredCats(result);
  };

  const handleFilter = (breed) => {
    setSelectedBreed(breed);
    if (breed) {
      const result = cats.filter((cat) => cat.breed === breed);
      setFilteredCats(result);
    } else {
      setFilteredCats(cats);
    }
  };

  return (
    <section className="text-center mt-4">
      <h2>Available Cats</h2>
      <p>Meet our adorable cats looking for their forever home!</p>

      <div className="d-flex justify-content-between align-items-center mb-4" style={{ gap: '10px' }}>
        <div className="d-flex">
          <input
            type="text"
            placeholder="Search by name"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="form-control"
          />
          <button onClick={handleSearch} className="btn btn-primary ms-2">Search</button>
        </div>
        <select
          value={selectedBreed}
          onChange={(e) => handleFilter(e.target.value)}
          className="form-select"
          style={{width:"280px"}}
        >
          <option value="">Filter by Breed</option>
          {[...new Set(cats.map((cat) => cat.breed))].map((breed, index) => (
            <option key={index} value={breed}>
              {breed}
            </option>
          ))}
        </select>
      </div>

      <div className="mt-2 row g-4 cats-container" id="cats-container">
        {filteredCats.map((cat, i) => (
          <div key={i} className="col-md-4">
            <div className="cat-card m-2">
              <img src={cat.image} alt={cat.name} className="img-fluid mb-2" style={{ borderRadius: '8px', height: '200px', objectFit: 'cover' }} />
              <div className="cat-info">
                <h3 className="h5 mb-1">{cat.name}</h3>
                <p className="mb-0">Age: {cat.age}</p>
                <p className="mb-0">Breed: {cat.breed}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}