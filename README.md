# [Snap](https://snap.patrickrompf.de)

Snap is an Audience Response System that allows its users to host live polls
based on single and multiple choice questions.

To get started you create a new interactive session. Afterwards you receive an
invitation code that you can hand over to your audience to join it. As soon as
everyone joined you can start live polls based on your questions and present
the results on a second screen afterwards.

Snap can be accessed at https://snap.patrickrompf.de.

## Deployment

You can use the given docker-compose.yml file to deploy Snap locally.
Make sure to change the default database username and password before you get started.
By default the database data is stored in a docker volume but you can also provide a local path instead.

1. open the file ./docker-compose.yml and replace `default_postgres_user` and `default_postgres_password` 
with values of your choice.
2. run `docker-compose up -d` to build the docker images and to start the necessary services.
3. run `docker-compose exec app rails db:setup` to setup the database tables.
4. open http://localhost:8080 in your browser.

Please note that you have to wipe your cookies after wiping the database as the user id stored in the cookie
does not exist any more in that case.

## License

Snap is licensed under [MIT](LICENSE).
