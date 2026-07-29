const products = [
  ['Nike','Mercurial Vapor 16 Elite FG','Campo',1499.90,'https://images.unsplash.com/photo-1553778263-73a83bab9b0c?auto=format&fit=crop&w=900&q=85'],
  ['Nike','Tiempo Legend 10 Academy TF','Fut7',499.90,'https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=900&q=85'],
  ['Nike','Lunar Gato II','Futsal',699.90,'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=900&q=85'],
  ['Adidas','Predator Elite FG','Campo',1399.90,'https://images.unsplash.com/photo-1518002171953-a080ee817e1f?auto=format&fit=crop&w=900&q=85'],
  ['Adidas','F50 League TF','Fut7',599.90,'https://images.unsplash.com/photo-1495555961986-6d4c1ecb7be3?auto=format&fit=crop&w=900&q=85'],
  ['Adidas','Top Sala Competition','Futsal',699.90,'https://images.unsplash.com/photo-1560769629-975ec94e6a86?auto=format&fit=crop&w=900&q=85'],
  ['Puma','Future Ultimate FG','Campo',1299.90,'https://images.unsplash.com/photo-1608231387042-66d1773070a5?auto=format&fit=crop&w=900&q=85'],
  ['Puma','Ultra Match TF','Fut7',499.90,'https://images.unsplash.com/photo-1460353581641-37baddab0fa2?auto=format&fit=crop&w=900&q=85'],
  ['Puma','King IT','Futsal',599.90,'https://images.unsplash.com/photo-1465453869711-7e174808ace9?auto=format&fit=crop&w=900&q=85'],
  ['Mizuno','Morelia Neo IV Beta FG','Campo',1299.90,'https://images.unsplash.com/photo-1511556820780-d912e42b4980?auto=format&fit=crop&w=900&q=85'],
  ['Mizuno','Morelia Neo TF','Fut7',999.90,'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?auto=format&fit=crop&w=900&q=85'],
  ['Mizuno','Morelia Sala IN','Futsal',899.90,'https://images.unsplash.com/photo-1543508282-6319a3e2621f?auto=format&fit=crop&w=900&q=85'],
  ['New Balance','Furon v8 Elite FG','Campo',1299.90,'https://images.unsplash.com/photo-1605348532760-6753d2c43329?auto=format&fit=crop&w=900&q=85'],
  ['New Balance','Tekela Magia TF','Fut7',699.90,'https://images.unsplash.com/photo-1603808033192-082d6919d3e1?auto=format&fit=crop&w=900&q=85'],
  ['New Balance','Audazo v6 Pro IN','Futsal',799.90,'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=900&q=85']
].map(([brand,name,category,price,image], index) => ({ id:index + 1, brand, name, category, price, image, sizes:[38,39,40,41,42,43,44], description:`${category === 'Campo' ? 'Velocidade, controle e tração para gramado.' : category === 'Fut7' ? 'Conforto e aderência para gramado sintético.' : 'Controle preciso e estabilidade para a quadra.'} Confirme a disponibilidade e as características com o atendimento MBM.` }));
