import { Controller } from '@nestjs/common';

@Controller('client')
export class ClientController {
  // generate client id and secret (only owners can do this)
  // refresh client secret (only owners can do this)
  // delete client (only owners can do this)
  // get client by id (admins and owners can do this)
  // get all clients for store (only owners can do this)
  // validate client secret (anyone can do this)
  // get client by secret (anyone can do this)
  // get client by id and secret (anyone can do this)
  // authorize client (anyone can do this)
  // revoke client (only owners can do this)
}
