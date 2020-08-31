MESSAGE=$1

rm -rf public/*
hugo -t kiera
cd public
mkdir notas-de-aula
cp -r ../notas-de-aula/* notas-de-aula/
git add --all
git commit -m "$MESSAGE"
git push origin gh-pages
